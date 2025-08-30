# Go API (Clean Architecture + SQLite/GORM)

This service implements a clean architecture with GORM (SQLite) persistence and orchestrates the microservices for encryption, blockchain, and results. Voting is gated by ENS verification.

Layers:

- internal/domain: entities and repository interfaces
- internal/infra: db (GORM + SQLite) and repository implementations
- internal/usecase: application logic (auth, voting, results)
- internal/service: external microservice calls
- internal/delivery/http: HTTP adapters (Fiber), JWT middleware

Endpoints:

- POST /api/register { email, password }
- POST /api/login { email, password }
- GET /api/me (Bearer JWT)
- POST /api/register-ens { ensName } (Bearer JWT)
- POST /api/submitVote { electionId, candidateIndex } (Bearer JWT)
- GET /api/results (Bearer JWT)

Env vars:

- PORT, JWT_SECRET, AES_KEY, DB_PATH
- ENCRYPTION_SERVICE_URL, BLOCKCHAIN_SERVICE_URL, RESULTS_SERVICE_URL

Local run:

1. Copy .env.example to .env and adjust keys
2. Install Go 1.22
3. go mod tidy
4. go run ./...
