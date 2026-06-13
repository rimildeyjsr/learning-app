type Resource = {
  title: string
  url: string
  source: string
}

type Flashcard = {
  question: string
  answer: string
}

export type Topic = {
  id: string
  title: string
  phaseId: string
  phaseTitle: string
  summary: string
  whyItExists: string
  interviewAngle: string
  projectPrompt: string
  resources: Resource[]
  flashcards: Flashcard[]
}

type PhaseSeed = {
  id: string
  title: string
  name: string
  description: string
  resources: Resource[]
  topicsText: string
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const makeFlashcards = (topic: string): Flashcard[] => [
  {
    question: `What problem does ${topic} solve, and when would you introduce it in a production system?`,
    answer: `Explain the bottleneck or risk first, then describe how ${topic} changes reliability, performance, security, or developer control. Interviewers usually want a tradeoff, not a definition.`,
  },
  {
    question: `What is the most common misuse or failure mode of ${topic}?`,
    answer: `Call out the naive implementation, the operational symptom it creates, and the mitigation you would add before shipping.`,
  },
  {
    question: `How would you explain ${topic} to a senior frontend engineer moving into backend or system design interviews?`,
    answer: `Anchor the answer in request flow, data flow, and user impact. Define where ${topic} sits in the stack and why the business notices when it is missing.`,
  },
]

const topicOverrides: Record<string, Resource[]> = {
  'how-the-internet-works': [
    {
      title: 'How the Web works',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/How_the_Web_works',
      source: 'MDN',
    },
    {
      title: 'What is the Internet?',
      url: 'https://www.cloudflare.com/learning/network-layer/what-is-the-internet/',
      source: 'Cloudflare',
    },
  ],
  'http-basics': [
    {
      title: 'HTTP overview',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview',
      source: 'MDN',
    },
    {
      title: 'What is HTTP?',
      url: 'https://www.cloudflare.com/learning/ddos/glossary/hypertext-transfer-protocol-http/',
      source: 'Cloudflare',
    },
  ],
  'https-basics': [
    {
      title: 'HTTPS',
      url: 'https://developer.mozilla.org/en-US/docs/Glossary/HTTPS',
      source: 'MDN',
    },
    {
      title: 'What is HTTPS?',
      url: 'https://www.cloudflare.com/learning/ssl/what-is-https/',
      source: 'Cloudflare',
    },
  ],
  dns: [
    {
      title: 'What is DNS?',
      url: 'https://www.cloudflare.com/learning/dns/what-is-dns/',
      source: 'Cloudflare',
    },
    {
      title: 'How DNS works',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_domain_name',
      source: 'MDN',
    },
  ],
  'domain-names': [
    {
      title: 'What is a domain name?',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_domain_name',
      source: 'MDN',
    },
    {
      title: 'What is a domain name?',
      url: 'https://www.cloudflare.com/learning/dns/glossary/what-is-a-domain-name/',
      source: 'Cloudflare',
    },
  ],
  hosting: [
    {
      title: 'What is web hosting?',
      url: 'https://aws.amazon.com/what-is/web-hosting/',
      source: 'AWS',
    },
    {
      title: 'What is web hosting?',
      url: 'https://www.cloudflare.com/learning/performance/glossary/web-hosting/',
      source: 'Cloudflare',
    },
  ],
  'browsers-and-servers': [
    {
      title: 'Client-server overview',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview',
      source: 'MDN',
    },
    {
      title: 'What is a web server?',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_web_server',
      source: 'MDN',
    },
  ],
  'client-server-architecture': [
    {
      title: 'Client-server overview',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview',
      source: 'MDN',
    },
    {
      title: 'Client-server architecture style',
      url: 'https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/client-server',
      source: 'Microsoft',
    },
  ],
  'request-response-lifecycle': [
    {
      title: 'HTTP messages',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages',
      source: 'MDN',
    },
    {
      title: 'What happens when you type a URL into your browser?',
      url: 'https://www.cloudflare.com/learning/dns/what-happens-when-you-type-a-url-into-your-browser/',
      source: 'Cloudflare',
    },
  ],
  'web-servers-nginx-apache-caddy': [
    {
      title: 'Beginner’s guide',
      url: 'https://nginx.org/en/docs/beginners_guide.html',
      source: 'Nginx',
    },
    {
      title: 'Apache HTTP Server documentation',
      url: 'https://httpd.apache.org/docs/2.4/',
      source: 'Apache',
    },
  ],
  'application-servers': [
    {
      title: 'What is an application server?',
      url: 'https://www.redhat.com/en/topics/middleware/what-is-application-server',
      source: 'Red Hat',
    },
    {
      title: 'What is an application server?',
      url: 'https://www.ibm.com/think/topics/application-server',
      source: 'IBM',
    },
  ],
  'static-vs-dynamic-content': [
    {
      title: 'What is a static website?',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Tools_and_setup/What_is_a_static_website',
      source: 'MDN',
    },
    {
      title: 'Server-side website programming first steps',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Introduction',
      source: 'MDN',
    },
  ],
  'reverse-proxy': [
    {
      title: 'What is a reverse proxy?',
      url: 'https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/',
      source: 'Cloudflare',
    },
    {
      title: 'Reverse proxy',
      url: 'https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/',
      source: 'Nginx',
    },
  ],
  'cdn-basics': [
    {
      title: 'What is a CDN?',
      url: 'https://www.cloudflare.com/learning/cdn/what-is-a-cdn/',
      source: 'Cloudflare',
    },
    {
      title: 'What is a CDN?',
      url: 'https://aws.amazon.com/what-is/cdn/',
      source: 'AWS',
    },
  ],
  'rest-apis': [
    {
      title: 'A beginner’s guide to REST',
      url: 'https://developer.mozilla.org/en-US/docs/Glossary/REST',
      source: 'MDN',
    },
    {
      title: 'REST API design best practices',
      url: 'https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design',
      source: 'Microsoft',
    },
  ],
  'json-apis': [
    {
      title: 'Working with JSON',
      url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/JSON',
      source: 'MDN',
    },
    {
      title: 'JSON:API',
      url: 'https://jsonapi.org/',
      source: 'JSON:API',
    },
  ],
  'openapi-specs': [
    {
      title: 'What is OpenAPI?',
      url: 'https://www.openapis.org/what-is-openapi',
      source: 'OpenAPI Initiative',
    },
    {
      title: 'OpenAPI specification',
      url: 'https://swagger.io/specification/',
      source: 'Swagger',
    },
  ],
  hateoas: [
    {
      title: 'HATEOAS and REST API implementation',
      url: 'https://restfulapi.net/hateoas/',
      source: 'REST API Tutorial',
    },
    {
      title: 'API design best practices',
      url: 'https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design',
      source: 'Microsoft',
    },
  ],
  soap: [
    {
      title: 'SOAP vs. REST',
      url: 'https://aws.amazon.com/compare/the-difference-between-soap-rest/',
      source: 'AWS',
    },
    {
      title: 'SOAP vs. REST',
      url: 'https://www.redhat.com/en/topics/integration/whats-the-difference-between-soap-rest',
      source: 'Red Hat',
    },
  ],
  grpc: [
    {
      title: 'Introduction to gRPC',
      url: 'https://grpc.io/docs/what-is-grpc/introduction/',
      source: 'gRPC',
    },
    {
      title: 'What is gRPC?',
      url: 'https://www.cloudflare.com/learning/performance/what-is-grpc/',
      source: 'Cloudflare',
    },
  ],
  graphql: [
    {
      title: 'GraphQL learn',
      url: 'https://graphql.org/learn/',
      source: 'GraphQL',
    },
    {
      title: 'Schema basics',
      url: 'https://www.apollographql.com/docs/apollo-server/schema/schema/',
      source: 'Apollo',
    },
  ],
  'api-versioning': [
    {
      title: 'API design best practices',
      url: 'https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design',
      source: 'Microsoft',
    },
    {
      title: 'Versioning',
      url: 'https://docs.stripe.com/api/versioning',
      source: 'Stripe',
    },
  ],
  'api-pagination': [
    {
      title: 'API design best practices',
      url: 'https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design',
      source: 'Microsoft',
    },
    {
      title: 'API pagination best practices',
      url: 'https://www.merge.dev/blog/api-pagination-best-practices',
      source: 'Merge',
    },
  ],
  'api-filtering-and-sorting': [
    {
      title: 'Filtering',
      url: 'https://jsonapi.org/recommendations/#filtering',
      source: 'JSON:API',
    },
    {
      title: 'API design best practices',
      url: 'https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design',
      source: 'Microsoft',
    },
  ],
  'idempotent-api-operations': [
    {
      title: 'Idempotent',
      url: 'https://developer.mozilla.org/en-US/docs/Glossary/Idempotent',
      source: 'MDN',
    },
    {
      title: 'Idempotent requests',
      url: 'https://docs.stripe.com/api/idempotent_requests',
      source: 'Stripe',
    },
  ],
  'authentication-vs-authorization': [
    {
      title: 'Authentication vs. authorization',
      url: 'https://auth0.com/docs/get-started/identity-fundamentals/authentication-and-authorization',
      source: 'Auth0',
    },
    {
      title: 'Authorization basics',
      url: 'https://owasp.org/www-community/Access_Control',
      source: 'OWASP',
    },
  ],
  jwt: [
    {
      title: 'JSON Web Tokens',
      url: 'https://auth0.com/docs/secure/tokens/json-web-tokens',
      source: 'Auth0',
    },
    {
      title: 'JWT introduction',
      url: 'https://jwt.io/introduction',
      source: 'jwt.io',
    },
  ],
  'sql-vs-nosql': [
    {
      title: 'PostgreSQL tutorial',
      url: 'https://www.postgresql.org/docs/current/tutorial.html',
      source: 'PostgreSQL',
    },
    {
      title: 'Data modeling introduction',
      url: 'https://www.mongodb.com/docs/manual/core/data-modeling-introduction/',
      source: 'MongoDB',
    },
  ],
  'database-indexes': [
    {
      title: 'Indexes',
      url: 'https://www.postgresql.org/docs/current/indexes.html',
      source: 'PostgreSQL',
    },
    {
      title: 'How indexing works',
      url: 'https://www.mongodb.com/docs/manual/indexes/',
      source: 'MongoDB',
    },
  ],
  transactions: [
    {
      title: 'Database transactions',
      url: 'https://www.postgresql.org/docs/current/tutorial-transactions.html',
      source: 'PostgreSQL',
    },
    {
      title: 'ACID transactions',
      url: 'https://www.mongodb.com/resources/basics/databases/acid-transactions',
      source: 'MongoDB',
    },
  ],
  'n-1-problem': [
    {
      title: 'N+1 query problem',
      url: 'https://www.prisma.io/dataguide/managing-databases/introduction-database-performance',
      source: 'Prisma',
    },
    {
      title: 'Optimize database use in applications',
      url: 'https://learn.microsoft.com/en-us/azure/architecture/antipatterns/chatty-io/',
      source: 'Microsoft',
    },
  ],
  'what-caching-solves': [
    {
      title: 'What is caching?',
      url: 'https://www.cloudflare.com/learning/cdn/what-is-caching/',
      source: 'Cloudflare',
    },
    {
      title: 'Redis caching patterns',
      url: 'https://redis.io/learn/howtos/solutions/caching',
      source: 'Redis',
    },
  ],
  'load-balancers': [
    {
      title: 'What is load balancing?',
      url: 'https://aws.amazon.com/what-is/load-balancing/',
      source: 'AWS',
    },
    {
      title: 'Load balancer patterns',
      url: 'https://learn.microsoft.com/en-us/azure/architecture/guide/design-principles/load-balancing',
      source: 'Microsoft',
    },
  ],
  observability: [
    {
      title: 'Observability primer',
      url: 'https://opentelemetry.io/docs/concepts/observability-primer/',
      source: 'OpenTelemetry',
    },
    {
      title: 'What is observability?',
      url: 'https://grafana.com/docs/grafana-cloud/introduction/what-is-observability/',
      source: 'Grafana',
    },
  ],
  'what-embeddings-are': [
    {
      title: 'Embeddings guide',
      url: 'https://platform.openai.com/docs/guides/embeddings',
      source: 'OpenAI',
    },
    {
      title: 'Vector embeddings overview',
      url: 'https://docs.pinecone.io/guides/get-started/overview',
      source: 'Pinecone',
    },
  ],
  'what-rag-is': [
    {
      title: 'RAG concepts',
      url: 'https://www.pinecone.io/learn/retrieval-augmented-generation/',
      source: 'Pinecone',
    },
    {
      title: 'Build a RAG application',
      url: 'https://python.langchain.com/docs/tutorials/rag/',
      source: 'LangChain',
    },
  ],
  'tools-function-calling': [
    {
      title: 'Function calling guide',
      url: 'https://platform.openai.com/docs/guides/function-calling',
      source: 'OpenAI',
    },
    {
      title: 'Tool use',
      url: 'https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview',
      source: 'Anthropic',
    },
  ],
  'prompt-injection-defense': [
    {
      title: 'Prompt injection',
      url: 'https://genai.owasp.org/llmrisk/llm01-prompt-injection/',
      source: 'OWASP',
    },
    {
      title: 'Safety best practices',
      url: 'https://platform.openai.com/docs/guides/safety-best-practices',
      source: 'OpenAI',
    },
  ],
  'multimodal-ai': [
    {
      title: 'Image generation guide',
      url: 'https://platform.openai.com/docs/guides/image-generation',
      source: 'OpenAI',
    },
    {
      title: 'Speech to text guide',
      url: 'https://platform.openai.com/docs/guides/speech-to-text',
      source: 'OpenAI',
    },
  ],
}

const phaseSeeds: PhaseSeed[] = [
  {
    id: 'phase-1',
    title: 'Phase 1',
    name: 'Web + backend foundations',
    description: 'Core web mechanics, request flow, servers, and API basics.',
    resources: [
      { title: 'HTTP overview', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview', source: 'MDN' },
      { title: 'What is DNS?', url: 'https://www.cloudflare.com/learning/dns/what-is-dns/', source: 'Cloudflare' },
    ],
    topicsText: `How the internet works
HTTP basics
HTTPS basics
DNS
Domain names
Hosting
Browsers and servers
Client-server architecture
Request-response lifecycle
Web servers: Nginx, Apache, Caddy
Application servers
Static vs dynamic content
Reverse proxy
CDN basics
REST APIs
JSON APIs
OpenAPI specs
HATEOAS
SOAP
gRPC
GraphQL
API versioning
API pagination
API filtering and sorting
Idempotent API operations`,
  },
  {
    id: 'phase-2',
    title: 'Phase 2',
    name: 'Auth, security, and API protection',
    description: 'Identity, session models, hashing, API hardening, and defensive patterns.',
    resources: [
      { title: 'OWASP API Security', url: 'https://owasp.org/API-Security/', source: 'OWASP' },
      { title: 'JSON Web Tokens', url: 'https://auth0.com/docs/secure/tokens/json-web-tokens', source: 'Auth0' },
    ],
    topicsText: `Authentication vs authorization
Basic authentication
Token authentication
JWT
Cookie-based auth
OAuth
OpenID Connect
SAML
Sessions
Password hashing
MD5 vs SHA
bcrypt
scrypt
CORS
SSL/TLS
CSP
OWASP risks
API security best practices
Server security basics
Federated identity
Gatekeeper pattern
Valet key pattern
Rate limiting
Throttling
Prompt injection as an AI security issue`,
  },
  {
    id: 'phase-3',
    title: 'Phase 3',
    name: 'Databases and data modeling',
    description: 'Data stores, schemas, transactions, indexing, and performance diagnosis.',
    resources: [
      { title: 'PostgreSQL tutorial', url: 'https://www.postgresql.org/docs/current/tutorial.html', source: 'PostgreSQL' },
      { title: 'Data modeling introduction', url: 'https://www.mongodb.com/docs/manual/core/data-modeling-introduction/', source: 'MongoDB' },
    ],
    topicsText: `Relational databases
PostgreSQL
MySQL
MariaDB
MS SQL
Oracle
SQLite
NoSQL databases
SQL vs NoSQL
Key-value stores
Redis
DynamoDB
Document databases
MongoDB
CouchDB
Wide-column stores
Cassandra
Graph databases
Neo4j
AWS Neptune
Time-series databases
InfluxDB
TimescaleDB
Database normalization
Denormalization
ACID
Transactions
Failure modes
Database indexes
Index table pattern
SQL tuning
N+1 problem
ORMs
Database profiling
Database migrations`,
  },
  {
    id: 'phase-4',
    title: 'Phase 4',
    name: 'Scaling databases and distributed data',
    description: 'Consistency models, replication, sharding, and data distribution tradeoffs.',
    resources: [
      { title: 'Read consistency', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html', source: 'AWS' },
      { title: 'Eventual consistency', url: 'https://www.cockroachlabs.com/glossary/distributed-db/eventual-consistency/', source: 'Cockroach Labs' },
    ],
    topicsText: `CAP theorem
Consistency vs availability
AP systems
CP systems
Strong consistency
Weak consistency
Eventual consistency
Database replication
Master-slave replication
Master-master replication
Data replication tradeoffs
Sharding
Sharding strategies
Federation
Scaling databases
Materialized views
CQRS
Event sourcing
Read-heavy vs write-heavy systems
Hot partitions
Data rebalancing`,
  },
  {
    id: 'phase-5',
    title: 'Phase 5',
    name: 'Caching',
    description: 'Caching layers, write paths, invalidation, and failure modes.',
    resources: [
      { title: 'What is caching?', url: 'https://www.cloudflare.com/learning/cdn/what-is-caching/', source: 'Cloudflare' },
      { title: 'Redis caching patterns', url: 'https://redis.io/learn/howtos/solutions/caching', source: 'Redis' },
    ],
    topicsText: `What caching solves
Client-side caching
CDN caching
Web server caching
Application caching
Database caching
Server-side caching
Cache-aside
Write-through cache
Write-behind cache
Refresh-ahead cache
Cache invalidation
Cache consistency
Redis as cache
Memcached
Caching failure modes
No caching as a performance antipattern`,
  },
  {
    id: 'phase-6',
    title: 'Phase 6',
    name: 'Queues, async, and real-time systems',
    description: 'Background work, messaging models, brokers, and real-time delivery choices.',
    resources: [
      { title: 'RabbitMQ tutorials', url: 'https://www.rabbitmq.com/tutorials', source: 'RabbitMQ' },
      { title: 'Kafka design', url: 'https://docs.confluent.io/kafka/design/index.html', source: 'Confluent' },
    ],
    topicsText: `Asynchronism
Background jobs
Scheduled jobs
Event-driven architecture
Schedule-driven architecture
Task queues
Message queues
Message brokers
RabbitMQ
Kafka
Publisher-subscriber pattern
Priority queues
Queue-based load leveling
Competing consumers
Pipes and filters
Choreography
Claim check pattern
Async request-reply
Backpressure
WebSockets
Server-sent events
Long polling
Short polling
Real-time data systems`,
  },
  {
    id: 'phase-7',
    title: 'Phase 7',
    name: 'Load balancing, availability, and reliability',
    description: 'Throughput, resilience patterns, failover, and availability engineering.',
    resources: [
      { title: 'What is load balancing?', url: 'https://aws.amazon.com/what-is/load-balancing/', source: 'AWS' },
      { title: 'Circuit breaker pattern', url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker', source: 'Microsoft' },
    ],
    topicsText: `Performance vs scalability
Latency vs throughput
Horizontal scaling
Vertical scaling
Load balancers
Load balancer vs reverse proxy
Load balancing algorithms
Layer 4 load balancing
Layer 7 load balancing
Failover
Active-active availability
Active-passive availability
Availability in numbers
Three 9s availability
Four 9s availability
Parallel vs sequential availability
Graceful degradation
Circuit breaker pattern
Retry pattern
Retry storms
Bulkhead pattern
Compensating transaction
High availability
Resiliency
Disaster-ish thinking: what fails and how users recover`,
  },
  {
    id: 'phase-8',
    title: 'Phase 8',
    name: 'Architecture patterns',
    description: 'System decomposition, service boundaries, gateways, and cloud patterns.',
    resources: [
      { title: 'Architecture patterns', url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/', source: 'Microsoft' },
      { title: 'What are microservices?', url: 'https://aws.amazon.com/microservices/', source: 'AWS' },
    ],
    topicsText: `Monoliths
Modular monoliths
Microservices
SOA
Serverless
Service mesh
Twelve-factor apps
Domain-driven design
CQRS as an architecture pattern
Event sourcing as an architecture pattern
Strangler fig pattern
Sidecar pattern
Ambassador pattern
Anti-corruption layer
Backend for frontend
Gateway routing
Gateway offloading
Gateway aggregation
External configuration store
Compute resource consolidation
Deployment stamps
Geodes
Leader election
Scheduler agent supervisor`,
  },
  {
    id: 'phase-9',
    title: 'Phase 9',
    name: 'Testing, delivery, observability, and infra',
    description: 'Shipping software safely, instrumenting it, and keeping it visible in production.',
    resources: [
      { title: 'Docker overview', url: 'https://docs.docker.com/get-started/docker-overview/', source: 'Docker' },
      { title: 'Observability primer', url: 'https://opentelemetry.io/docs/concepts/observability-primer/', source: 'OpenTelemetry' },
    ],
    topicsText: `Git
GitHub
GitLab
Bitbucket
Unit testing
Functional testing
Integration testing
Test-driven development
CI/CD
Docker
Containerization vs virtualization
LXC
Kubernetes basics
DevOps basics
Monitoring
Health monitoring
Availability monitoring
Performance monitoring
Security monitoring
Usage monitoring
Instrumentation
Telemetry
Logging
Visualization and alerts
Observability`,
  },
  {
    id: 'phase-10',
    title: 'Phase 10',
    name: 'Performance antipatterns',
    description: 'Common system and application mistakes that kill latency, scale, or resource efficiency.',
    resources: [
      { title: 'Architecture antipatterns', url: 'https://learn.microsoft.com/en-us/azure/architecture/antipatterns/', source: 'Microsoft' },
      { title: 'Chatty I/O antipattern', url: 'https://learn.microsoft.com/en-us/azure/architecture/antipatterns/chatty-io/', source: 'Microsoft' },
    ],
    topicsText: `Busy database
Busy frontend
Chatty I/O
Extraneous fetching
Improper instantiation
Monolithic persistence
No caching
Noisy neighbor
Synchronous I/O
Retry storm
N+1 queries
Over-fetching and under-fetching
API chattiness from frontend/backend mismatch`,
  },
  {
    id: 'phase-11',
    title: 'Phase 11',
    name: 'Search and specialized storage',
    description: 'Search engines, indexing mechanics, and when search differs from normal querying.',
    resources: [
      { title: 'Elasticsearch getting started', url: 'https://www.elastic.co/guide/en/elasticsearch/reference/current/getting-started.html', source: 'Elastic' },
      { title: 'Solr introduction', url: 'https://solr.apache.org/guide/solr/latest/getting-started/introduction.html', source: 'Solr' },
    ],
    topicsText: `Search engines
Elasticsearch
Solr
Full-text search basics
Search indexing
Search relevance
Search vs database query
Vector search preview
Hybrid search preview`,
  },
  {
    id: 'phase-12',
    title: 'Phase 12',
    name: 'AI engineer foundations',
    description: 'Core concepts, model behavior, token economics, and the role itself.',
    resources: [
      { title: 'OpenAI docs overview', url: 'https://platform.openai.com/docs/overview', source: 'OpenAI' },
      { title: 'LLM course introduction', url: 'https://huggingface.co/learn/llm-course/chapter1/1', source: 'Hugging Face' },
    ],
    topicsText: `What is an AI engineer?
AI engineer vs ML engineer
AI vs AGI
Common AI terminology
Impact of AI on product development
AI engineer roles and responsibilities
Using pretrained models
Benefits of pretrained models
Limitations of pretrained models
Popular AI models
Open vs closed models
Model capabilities
Context length
Knowledge cutoff dates
Inference
Training
Fine-tuning vs prompting
Tokens
Token counting
Maximum tokens
Pricing considerations`,
  },
  {
    id: 'phase-13',
    title: 'Phase 13',
    name: 'OpenAI, model APIs, and LLM app development',
    description: 'Model platforms, prompting, structured outputs, tools, and provider ecosystem awareness.',
    resources: [
      { title: 'OpenAI API overview', url: 'https://platform.openai.com/docs/overview', source: 'OpenAI' },
      { title: 'Anthropic docs', url: 'https://docs.anthropic.com/en/docs/', source: 'Anthropic' },
    ],
    topicsText: `OpenAI platform
OpenAI API
Chat Completions API
Writing prompts
OpenAI Playground
Managing API tokens
Streaming responses
Structured outputs
Function calling / tools
OpenAI Assistants API
Azure AI
AWS SageMaker
Anthropic Claude
Google Gemini
Mistral AI
Cohere
Hugging Face models`,
  },
  {
    id: 'phase-14',
    title: 'Phase 14',
    name: 'Embeddings and vector databases',
    description: 'Vector representations, similarity search, and storage systems for retrieval.',
    resources: [
      { title: 'Embeddings guide', url: 'https://platform.openai.com/docs/guides/embeddings', source: 'OpenAI' },
      { title: 'Pinecone overview', url: 'https://docs.pinecone.io/guides/get-started/overview', source: 'Pinecone' },
    ],
    topicsText: `What embeddings are
Embedding models
OpenAI embeddings API
OpenAI embedding models
Open-source embeddings
Sentence Transformers
Models on Hugging Face
Embedding pricing
Semantic search
Recommendation systems
Anomaly detection
Data classification
Vector databases
Chroma
Pinecone
Weaviate
FAISS
LanceDB
Qdrant
Supabase vector storage
MongoDB Atlas vector search
Indexing embeddings
Similarity search
Implementing vector search`,
  },
  {
    id: 'phase-15',
    title: 'Phase 15',
    name: 'RAG',
    description: 'Retrieval-augmented generation, chunking, freshness, and source-aware answer quality.',
    resources: [
      { title: 'RAG concepts', url: 'https://www.pinecone.io/learn/retrieval-augmented-generation/', source: 'Pinecone' },
      { title: 'RAG tutorial', url: 'https://python.langchain.com/docs/tutorials/rag/', source: 'LangChain' },
    ],
    topicsText: `What RAG is
RAG use cases
RAG vs fine-tuning
Chunking
Embedding documents
Storing chunks in vector DB
Retrieval process
Generation step
Implementing RAG
RAG with SDKs directly
RAG with LangChain
RAG with LlamaIndex
RAG with OpenAI Assistants API
RAG with Replicate
RAG evaluation basics
Hallucination handling
Source citation design
Freshness and stale data in RAG
Access control in RAG`,
  },
  {
    id: 'phase-16',
    title: 'Phase 16',
    name: 'AI agents',
    description: 'Tool-using systems, planning loops, memory, guardrails, and failure modes.',
    resources: [
      { title: 'Function calling guide', url: 'https://platform.openai.com/docs/guides/function-calling', source: 'OpenAI' },
      { title: 'Tool use overview', url: 'https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview', source: 'Anthropic' },
    ],
    topicsText: `What AI agents are
Agent use cases
RAG vs agents
ReAct prompting
Manual agent implementation
Tools / function calling
OpenAI tools
OpenAI Assistants API for agents
Building AI agents
Planning loops
Tool selection
Memory
Human-in-the-loop flows
Agent failure modes
Agent observability
Agent evals
Guardrails`,
  },
  {
    id: 'phase-17',
    title: 'Phase 17',
    name: 'AI safety, ethics, and production concerns',
    description: 'Prompt injection, moderation, privacy, misuse controls, and production risk management.',
    resources: [
      { title: 'Safety best practices', url: 'https://platform.openai.com/docs/guides/safety-best-practices', source: 'OpenAI' },
      { title: 'Prompt injection', url: 'https://genai.owasp.org/llmrisk/llm01-prompt-injection/', source: 'OWASP' },
    ],
    topicsText: `AI safety issues
Bias and fairness
Security and privacy concerns
Adversarial testing
Moderation APIs
End-user IDs in prompts
Robust prompt engineering
Knowing customers and use cases
Constraining inputs
Constraining outputs
Safety best practices
Prompt injection defense
PII handling
Abuse monitoring
AI product risk review`,
  },
  {
    id: 'phase-18',
    title: 'Phase 18',
    name: 'Open-source and local AI',
    description: 'Open model ecosystems, local inference, SDKs, and tradeoffs versus hosted APIs.',
    resources: [
      { title: 'Hugging Face Hub quickstart', url: 'https://huggingface.co/docs/huggingface_hub/en/quick-start', source: 'Hugging Face' },
      { title: 'Ollama library', url: 'https://ollama.com/library', source: 'Ollama' },
    ],
    topicsText: `Open-source AI
Open vs closed-source models
Popular open-source models
Hugging Face Hub
Hugging Face tasks
Finding open-source models
Using open-source models
Inference SDKs
Transformers.js
Ollama
Ollama models
Ollama SDK
Local inference tradeoffs
Running models locally vs API models`,
  },
  {
    id: 'phase-19',
    title: 'Phase 19',
    name: 'Multimodal AI',
    description: 'Working with image, audio, speech, and multi-input product flows.',
    resources: [
      { title: 'Image generation guide', url: 'https://platform.openai.com/docs/guides/image-generation', source: 'OpenAI' },
      { title: 'Speech to text guide', url: 'https://platform.openai.com/docs/guides/speech-to-text', source: 'OpenAI' },
    ],
    topicsText: `Multimodal AI
Multimodal use cases
Image understanding
Image generation
Video understanding
Audio processing
Text-to-speech
Speech-to-text
OpenAI Vision API
DALL-E API
Whisper API
Hugging Face multimodal models
LangChain for multimodal apps
LlamaIndex for multimodal apps
Implementing multimodal AI`,
  },
]

export const roadmapPhases = phaseSeeds.map((phase) => {
  const topics = phase.topicsText.split('\n').map((title) => {
    const id = slugify(title)

    return {
      id,
      title,
      phaseId: phase.id,
      phaseTitle: `${phase.title} · ${phase.name}`,
      summary: `${title} in practical interview terms, including where it fits in real systems and what tradeoffs matter.`,
      whyItExists: `${title} exists because systems fail, slow down, or become unsafe when this concept is ignored.`,
      interviewAngle: `Expect to explain ${title} with a concrete example, a tradeoff, and one operational failure mode.`,
      projectPrompt: `Build a tiny example or architecture sketch that forces you to use ${title} in context.`,
      resources: topicOverrides[id] ?? phase.resources,
      flashcards: makeFlashcards(title),
    }
  })

  return {
    ...phase,
    topics,
  }
})

export const allTopics = roadmapPhases.flatMap((phase) => phase.topics)

export const priorityTopicIds = [
  'http-basics',
  'dns',
  'rest-apis',
  'authentication-vs-authorization',
  'jwt',
  'sql-vs-nosql',
  'database-indexes',
  'transactions',
  'n-1-problem',
  'what-caching-solves',
  'load-balancers',
  'observability',
  'what-rag-is',
  'what-embeddings-are',
  'tools-function-calling',
  'prompt-injection-defense',
  'multimodal-ai',
]
