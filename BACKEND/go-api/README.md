# Go API (Core Backend)

Endpoints:
- POST /api/register { email, password }
- POST /api/login { email, password }
- POST /api/submitVote { electionId, candidateIndex } (Bearer JWT)
- GET /api/results (Bearer JWT)

This API orchestrates the microservices:
- Encryption service: ENCRYPTION_URL (default http://localhost:4001/encryptVote)
- Blockchain service: BLOCKCHAIN_URL (default http://localhost:4002/submitVote)
- Blockchain results list: BLOCKCHAIN_RESULTS_URL (default http://localhost:4002/getEncryptedResults)
- Results service: RESULTS_URL (default http://localhost:4003/decryptResults)

Local run:
1) Copy .env.example to .env and adjust keys
2) Install Go 1.22
3) Run: go run ./...
