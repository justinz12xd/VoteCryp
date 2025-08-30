# Go API Clean Architecture

Layers:

- internal/domain: entities and repository interfaces
- internal/infra: db (GORM + SQLite) and repository implementations
- internal/usecase: application logic (auth, voting, results)
- internal/service: external microservice calls
- internal/delivery/http: HTTP adapters (Fiber), JWT middleware

Persistence:

- GORM with pure-Go SQLite driver (github.com/glebarez/sqlite)
- DB path configurable via DB_PATH (default /tmp/go-api.db)

Env vars consumed:

- PORT, JWT_SECRET, AES_KEY
- ENCRYPTION_SERVICE_URL, BLOCKCHAIN_SERVICE_URL, RESULTS_SERVICE_URL
- DB_PATH

Endpoints (compat):

- POST /api/register, POST /api/login
- GET /api/me, POST /api/register-ens, POST /api/submitVote, GET /api/results
