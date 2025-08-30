# Microservices for VoteCryp

Ports:

- encryption-service: 4001
- blockchain-service: 4002
- results-service: 4003

Start locally:

- encryption-service: npm install; npm run start
- blockchain-service: npm install; npm run start
- results-service: npm install; npm run start

Environment variables:

- blockchain-service: RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS (defaults to BLOCKCHAIN/contract-config.js network)
