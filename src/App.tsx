import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { allTopics, priorityTopicIds, roadmapPhases } from './roadmap'

type TabId = 'roadmap' | 'daily' | 'flashcards'

type TopicProgress = {
  completed: boolean
  mastery: number
  reviews: number
  articleReads: number
  lastReviewed?: string
  completedAt?: string
}

type DrillCard = {
  topicId: string
  question: string
  answer: string
}

type DrillSession = {
  cards: DrillCard[]
  currentIndex: number
  reveal: boolean
  scores: number[]
}

type AppState = {
  activeTab: TabId
  currentDailyTopicId: string
  topicProgress: Record<string, TopicProgress>
  activityDates: string[]
  focusMinutes: number
  focusEndsAt?: number
  drillSession?: DrillSession
}

const STORAGE_KEY = 'learning-app-state-v1'

const todayKey = () => new Date().toISOString().slice(0, 10)

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const shuffle = <T,>(items: T[]) => {
  const next = [...items]

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[next[index], next[swapIndex]] = [next[swapIndex], next[index]]
  }

  return next
}

const createDefaultProgress = () =>
  Object.fromEntries(
    allTopics.map((topic) => [
      topic.id,
      {
        completed: false,
        mastery: 0,
        reviews: 0,
        articleReads: 0,
      },
    ]),
  ) satisfies Record<string, TopicProgress>

const pickNextTopic = (progress: Record<string, TopicProgress>) => {
  const priority = allTopics.find((topic) => !progress[topic.id]?.completed && priorityTopicIds.includes(topic.id))

  if (priority) {
    return priority.id
  }

  const nextUnfinished = allTopics.find((topic) => !progress[topic.id]?.completed)
  return nextUnfinished?.id ?? allTopics[0].id
}

const createInitialState = (): AppState => {
  const topicProgress = createDefaultProgress()

  return {
    activeTab: 'roadmap',
    currentDailyTopicId: pickNextTopic(topicProgress),
    topicProgress,
    activityDates: [],
    focusMinutes: 20,
  }
}

const loadState = () => {
  if (typeof window === 'undefined') {
    return createInitialState()
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return createInitialState()
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AppState>
    const topicProgress = {
      ...createDefaultProgress(),
      ...parsed.topicProgress,
    }

    return {
      ...createInitialState(),
      ...parsed,
      topicProgress,
      currentDailyTopicId:
        parsed.currentDailyTopicId && topicProgress[parsed.currentDailyTopicId]
          ? parsed.currentDailyTopicId
          : pickNextTopic(topicProgress),
    }
  } catch {
    return createInitialState()
  }
}

const formatDate = (value?: string) => {
  if (!value) {
    return 'Not yet'
  }

  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

const formatPercent = (value: number) => `${Math.round(value)}%`

const buildDrillCards = (progress: Record<string, TopicProgress>) => {
  const finished = allTopics.filter((topic) => progress[topic.id]?.completed)
  const cards = finished.flatMap((topic) =>
    topic.flashcards.map((card) => ({
      topicId: topic.id,
      question: card.question,
      answer: card.answer,
    })),
  )

  return shuffle(cards).slice(0, Math.min(cards.length, 10))
}

function App() {
  const [state, setState] = useState<AppState>(loadState)
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    if (!state.focusEndsAt) {
      setTimeLeft(0)
      return
    }

    const tick = () => {
      const seconds = Math.max(0, Math.floor((state.focusEndsAt! - Date.now()) / 1000))
      setTimeLeft(seconds)

      if (seconds === 0) {
        setState((current) => {
          if (!current.focusEndsAt) {
            return current
          }

          return {
            ...current,
            focusEndsAt: undefined,
            activityDates: current.activityDates.includes(todayKey())
              ? current.activityDates
              : [...current.activityDates, todayKey()],
          }
        })
      }
    }

    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [state.focusEndsAt])

  const topicLookup = useMemo(
    () => Object.fromEntries(allTopics.map((topic) => [topic.id, topic])),
    [],
  )

  const totalTopics = allTopics.length
  const completedTopics = allTopics.filter((topic) => state.topicProgress[topic.id]?.completed).length
  const overallProgress = (completedTopics / totalTopics) * 100
  const averageMastery =
    allTopics.reduce((sum, topic) => sum + state.topicProgress[topic.id].mastery, 0) / totalTopics

  const phaseMetrics = roadmapPhases.map((phase) => {
    const done = phase.topics.filter((topic) => state.topicProgress[topic.id]?.completed).length
    const mastery =
      phase.topics.reduce((sum, topic) => sum + state.topicProgress[topic.id].mastery, 0) /
      phase.topics.length

    return {
      ...phase,
      done,
      progress: (done / phase.topics.length) * 100,
      mastery,
    }
  })

  const dailyTopic = topicLookup[state.currentDailyTopicId] ?? allTopics[0]
  const dailyProgress = state.topicProgress[dailyTopic.id]

  const finishedTopics = allTopics.filter((topic) => state.topicProgress[topic.id]?.completed)
  const finishedCards = finishedTopics.flatMap((topic) =>
    topic.flashcards.map((card) => ({ ...card, topicTitle: topic.title })),
  )

  const streak = (() => {
    const dates = new Set(state.activityDates)
    let count = 0
    const cursor = new Date()

    while (dates.has(cursor.toISOString().slice(0, 10))) {
      count += 1
      cursor.setDate(cursor.getDate() - 1)
    }

    return count
  })()

  const drillSession = state.drillSession
  const currentCard = drillSession?.cards[drillSession.currentIndex]
  const completedDrill = drillSession
    ? drillSession.currentIndex >= drillSession.cards.length
    : false

  const updateTopicProgress = (topicId: string, updater: (current: TopicProgress) => TopicProgress) => {
    setState((current) => ({
      ...current,
      topicProgress: {
        ...current.topicProgress,
        [topicId]: updater(current.topicProgress[topicId]),
      },
      activityDates: current.activityDates.includes(todayKey())
        ? current.activityDates
        : [...current.activityDates, todayKey()],
    }))
  }

  const setDailyTopic = (topicId: string) => {
    setState((current) => ({
      ...current,
      currentDailyTopicId: topicId,
      activeTab: 'daily',
    }))
  }

  const advanceDailyTopic = () => {
    const unfinished = allTopics.filter((topic) => !state.topicProgress[topic.id]?.completed)
    const pool = unfinished.length > 0 ? unfinished : allTopics
    const currentIndex = pool.findIndex((topic) => topic.id === state.currentDailyTopicId)
    const nextTopic = pool[(currentIndex + 1 + pool.length) % pool.length]
    setDailyTopic(nextTopic.id)
  }

  const startDrill = () => {
    const cards = buildDrillCards(state.topicProgress)

    if (cards.length === 0) {
      return
    }

    setState((current) => ({
      ...current,
      activeTab: 'flashcards',
      drillSession: {
        cards,
        currentIndex: 0,
        reveal: false,
        scores: [],
      },
    }))
  }

  const scoreCard = (score: number) => {
    if (!currentCard || !drillSession) {
      return
    }

    const currentProgress = state.topicProgress[currentCard.topicId]
    const nextMastery = clamp(currentProgress.mastery + score * 6 - 10, 0, 100)

    setState((current) => ({
      ...current,
      topicProgress: {
        ...current.topicProgress,
        [currentCard.topicId]: {
          ...current.topicProgress[currentCard.topicId],
          mastery: nextMastery,
          reviews: current.topicProgress[currentCard.topicId].reviews + 1,
          lastReviewed: new Date().toISOString(),
        },
      },
      activityDates: current.activityDates.includes(todayKey())
        ? current.activityDates
        : [...current.activityDates, todayKey()],
      drillSession: current.drillSession
        ? {
            ...current.drillSession,
            currentIndex: current.drillSession.currentIndex + 1,
            reveal: false,
            scores: [...current.drillSession.scores, score],
          }
        : undefined,
    }))
  }

  const averageDrillScore =
    drillSession && drillSession.scores.length > 0
      ? drillSession.scores.reduce((sum, value) => sum + value, 0) / drillSession.scores.length
      : 0

  return (
    <div className="app-shell">
      <header className="hero-panel">
        <div>
          <p className="eyebrow">Interview Prep Operating System</p>
          <h1>Greenroom</h1>
          <p className="hero-copy">
            A white-and-green study cockpit for backend, system design, and AI engineer prep. Pick the
            next topic, read the best material, and get grilled daily until recall is automatic.
          </p>
        </div>

        <div className="hero-stats">
          <article>
            <span>Path Progress</span>
            <strong>{formatPercent(overallProgress)}</strong>
            <small>{completedTopics} of {totalTopics} topics done</small>
          </article>
          <article>
            <span>Average Mastery</span>
            <strong>{formatPercent(averageMastery)}</strong>
            <small>Built from your self-scored interview drills</small>
          </article>
          <article>
            <span>Consistency Streak</span>
            <strong>{streak} day{streak === 1 ? '' : 's'}</strong>
            <small>Any read, review, or focus sprint counts</small>
          </article>
        </div>
      </header>

      <section className="focus-strip">
        <div>
          <p className="strip-label">Today’s next action</p>
          <strong>{dailyTopic.title}</strong>
          <span>{dailyTopic.phaseTitle}</span>
        </div>

        <div className="focus-actions">
          <label className="minutes-picker">
            Sprint
            <select
              value={state.focusMinutes}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  focusMinutes: Number(event.target.value),
                }))
              }
            >
              <option value={5}>5 min restart</option>
              <option value={20}>20 min focus</option>
              <option value={30}>30 min deep dive</option>
            </select>
          </label>

          <button
            className="primary-button"
            type="button"
            onClick={() =>
              setState((current) => ({
                ...current,
                focusEndsAt: Date.now() + current.focusMinutes * 60 * 1000,
              }))
            }
          >
            {state.focusEndsAt ? 'Restart timer' : 'Start timer'}
          </button>

          <div className="timer-pill">
            {state.focusEndsAt
              ? `${Math.floor(timeLeft / 60)}:${`${timeLeft % 60}`.padStart(2, '0')} left`
              : 'No timer running'}
          </div>
        </div>
      </section>

      <nav className="tab-row" aria-label="Primary">
        {[
          ['roadmap', 'Roadmap'],
          ['daily', 'Daily Learning'],
          ['flashcards', 'Flashcards'],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={state.activeTab === id ? 'tab active' : 'tab'}
            onClick={() =>
              setState((current) => ({
                ...current,
                activeTab: id as TabId,
              }))
            }
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="content-grid">
        <section className="main-panel">
          {state.activeTab === 'roadmap' && (
            <div className="stack">
              <article className="panel-card">
                <div className="panel-header">
                  <div>
                    <p className="strip-label">Roadmap</p>
                    <h2>Modules with visible progress</h2>
                  </div>
                  <button className="ghost-button" type="button" onClick={() => setDailyTopic(pickNextTopic(state.topicProgress))}>
                    Jump to next priority
                  </button>
                </div>

                <div className="summary-bar">
                  <div>
                    <span>Total completion</span>
                    <strong>{formatPercent(overallProgress)}</strong>
                  </div>
                  <div className="progress-track">
                    <span style={{ width: `${overallProgress}%` }} />
                  </div>
                </div>
              </article>

              {phaseMetrics.map((phase) => (
                <article className="panel-card" key={phase.id}>
                  <div className="phase-heading">
                    <div>
                      <p className="eyebrow">{phase.title}</p>
                      <h3>{phase.name}</h3>
                      <p className="phase-copy">{phase.description}</p>
                    </div>
                    <div className="phase-stats">
                      <strong>{formatPercent(phase.progress)}</strong>
                      <span>{phase.done}/{phase.topics.length} complete</span>
                      <small>{formatPercent(phase.mastery)} mastery</small>
                    </div>
                  </div>

                  <div className="progress-track phase">
                    <span style={{ width: `${phase.progress}%` }} />
                  </div>

                  <div className="topic-list">
                    {phase.topics.map((topic) => {
                      const progress = state.topicProgress[topic.id]

                      return (
                        <label className={progress.completed ? 'topic-chip done' : 'topic-chip'} key={topic.id}>
                          <input
                            type="checkbox"
                            checked={progress.completed}
                            onChange={() =>
                              updateTopicProgress(topic.id, (current) => ({
                                ...current,
                                completed: !current.completed,
                                completedAt: !current.completed ? new Date().toISOString() : undefined,
                                mastery: !current.completed ? Math.max(current.mastery, 35) : current.mastery,
                              }))
                            }
                          />
                          <span>{topic.title}</span>
                          <small>{progress.completed ? `${progress.mastery}% mastery` : 'Not done'}</small>
                        </label>
                      )
                    })}
                  </div>
                </article>
              ))}
            </div>
          )}

          {state.activeTab === 'daily' && (
            <div className="stack">
              <article className="panel-card daily-hero">
                <div className="panel-header">
                  <div>
                    <p className="strip-label">Daily Learning</p>
                    <h2>{dailyTopic.title}</h2>
                    <p className="phase-copy">{dailyTopic.summary}</p>
                  </div>
                  <div className="daily-badge">
                    <span>{dailyTopic.phaseTitle}</span>
                    <strong>{dailyProgress.articleReads}/2 reads logged</strong>
                  </div>
                </div>

                <div className="daily-grid">
                  <div className="daily-column">
                    <h3>Read these first</h3>
                    <div className="resource-list">
                      {dailyTopic.resources.map((resource) => (
                        <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer" className="resource-card">
                          <span>{resource.source}</span>
                          <strong>{resource.title}</strong>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="daily-column">
                    <h3>Why this matters</h3>
                    <ul className="clean-list">
                      <li>{dailyTopic.whyItExists}</li>
                      <li>{dailyTopic.interviewAngle}</li>
                      <li>{dailyTopic.projectPrompt}</li>
                    </ul>
                  </div>
                </div>

                <div className="daily-actions">
                  <button
                    className="primary-button"
                    type="button"
                    onClick={() =>
                      updateTopicProgress(dailyTopic.id, (current) => ({
                        ...current,
                        articleReads: Math.min(2, current.articleReads + 1),
                        mastery: Math.max(current.mastery, 20),
                      }))
                    }
                  >
                    Log one article
                  </button>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() =>
                      updateTopicProgress(dailyTopic.id, (current) => ({
                        ...current,
                        completed: true,
                        articleReads: 2,
                        mastery: Math.max(current.mastery, 45),
                        completedAt: new Date().toISOString(),
                      }))
                    }
                  >
                    Mark topic complete
                  </button>
                  <button className="ghost-button" type="button" onClick={advanceDailyTopic}>
                    Pick another topic
                  </button>
                </div>
              </article>

              <article className="panel-card">
                <h3>ADHD-friendly routine</h3>
                <div className="habit-grid">
                  <div>
                    <strong>1. Start tiny</strong>
                    <p>Use the 5-minute restart when momentum is low. Starting counts more than perfect completion.</p>
                  </div>
                  <div>
                    <strong>2. Keep one target</strong>
                    <p>This tab always keeps exactly one active topic in front of you so you do not context-switch yourself to death.</p>
                  </div>
                  <div>
                    <strong>3. Close the loop fast</strong>
                    <p>As soon as you finish reading, mark the topic done and send it to flashcards while the memory is fresh.</p>
                  </div>
                </div>
              </article>
            </div>
          )}

          {state.activeTab === 'flashcards' && (
            <div className="stack">
              <article className="panel-card">
                <div className="panel-header">
                  <div>
                    <p className="strip-label">Flashcards</p>
                    <h2>Interview-style random drills</h2>
                  </div>
                  <button className="primary-button" type="button" onClick={startDrill} disabled={finishedCards.length === 0}>
                    Start daily grill
                  </button>
                </div>

                {finishedCards.length === 0 && (
                  <p className="empty-state">Finish a few topics first. Completed topics automatically unlock interview questions here.</p>
                )}

                {drillSession && !completedDrill && currentCard && (
                  <div className="drill-card">
                    <p className="strip-label">Question {drillSession.currentIndex + 1} of {drillSession.cards.length}</p>
                    <h3>{topicLookup[currentCard.topicId].title}</h3>
                    <p className="question-copy">{currentCard.question}</p>

                    {drillSession.reveal ? (
                      <div className="answer-block">
                        <strong>Target answer</strong>
                        <p>{currentCard.answer}</p>
                      </div>
                    ) : (
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() =>
                          setState((current) => ({
                            ...current,
                            drillSession: current.drillSession
                              ? { ...current.drillSession, reveal: true }
                              : undefined,
                          }))
                        }
                      >
                        Reveal answer
                      </button>
                    )}

                    {drillSession.reveal && (
                      <div className="score-row">
                        {[1, 2, 3, 4, 5].map((score) => (
                          <button key={score} type="button" className="score-button" onClick={() => scoreCard(score)}>
                            {score}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {drillSession && completedDrill && (
                  <div className="result-block">
                    <h3>Session complete</h3>
                    <p>You finished {drillSession.cards.length} random questions.</p>
                    <strong>{averageDrillScore.toFixed(1)} / 5 average self-score</strong>
                    <button
                      className="ghost-button"
                      type="button"
                      onClick={() =>
                        setState((current) => ({
                          ...current,
                          drillSession: undefined,
                        }))
                      }
                    >
                      Clear session
                    </button>
                  </div>
                )}
              </article>

              <article className="panel-card">
                <h3>Unlocked topics</h3>
                <div className="topic-list">
                  {finishedTopics.map((topic) => {
                    const progress = state.topicProgress[topic.id]
                    return (
                      <div className="topic-chip done" key={topic.id}>
                        <span>{topic.title}</span>
                        <small>
                          {progress.reviews} reviews • last {formatDate(progress.lastReviewed)}
                        </small>
                      </div>
                    )
                  })}
                </div>
              </article>
            </div>
          )}
        </section>

        <aside className="side-panel">
          <article className="panel-card">
            <p className="strip-label">Priority track</p>
            <h3>Start here first</h3>
            <div className="priority-list">
              {priorityTopicIds.map((topicId) => {
                const topic = topicLookup[topicId]
                const progress = state.topicProgress[topicId]

                return (
                  <button key={topicId} type="button" className="priority-item" onClick={() => setDailyTopic(topicId)}>
                    <span>{topic.title}</span>
                    <small>{progress.completed ? 'Done' : `${progress.mastery}% ready`}</small>
                  </button>
                )
              })}
            </div>
          </article>

          <article className="panel-card">
            <p className="strip-label">Brain-friendly rules</p>
            <h3>Keep the system easy to obey</h3>
            <ul className="clean-list">
              <li>Never choose from the full list when you are tired. Use the priority track or today’s topic.</li>
              <li>One read session, one completed topic, one drill. Small loops beat heroic plans.</li>
              <li>If you miss a day, resume with a 5-minute restart instead of trying to make up everything.</li>
            </ul>
          </article>
        </aside>
      </main>
    </div>
  )
}

export default App
