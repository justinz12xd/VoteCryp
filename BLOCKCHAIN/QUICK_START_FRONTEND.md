# 🚀 INSTRUCCIONES RÁPIDAS PARA EL FRONTEND

## 📥 1. DESCARGAR CAMBIOS
```bash
git checkout features/blockchain-contracts
git pull origin features/blockchain-contracts
```

## ⚡ 2. VERIFICAR QUE FUNCIONA
```bash
cd BLOCKCHAIN
npm install
npm test
```
**✅ Debería ver: "22 passing"**

## 🧪 3. TEST RÁPIDO PARA FRONTEND
```bash
# Ejecutar el test de integración
node test-frontend.js
```
**✅ Debería ver: "TODOS LOS TESTS PASARON"**

## 📱 4. PARA TU DESARROLLO FRONTEND

### Archivos importantes:
- `contract-config.js` - Configuración y ABI
- `voting-contract-api.js` - API completa para usar
- `FRONTEND_INTEGRATION.md` - Documentación detallada

### Configuración MetaMask:
- **Network Name:** Hardhat Local
- **RPC URL:** http://127.0.0.1:8545
- **Chain ID:** 31337
- **Contract Address:** 0x5FbDB2315678afecb367f032d93F642f64180aa3

### Ejemplo básico:
```javascript
import VotingContractAPI from './blockchain/voting-contract-api.js';

const api = new VotingContractAPI();
await api.connect(); // Conecta MetaMask
await api.registerENS('usuario.eth');
await api.createElection('Mi Elección', 'Descripción', ['Sí', 'No'], 24);
await api.vote(1, 0);
const results = await api.getResults(1);
```

## 🆘 SI ALGO NO FUNCIONA

### Error: "Cannot find module"
```bash
npm install
```

### Error: "Contract not deployed"
```bash
npm run deploy
```

### Error: "Connection refused"
```bash
# En otra terminal, mantener corriendo:
npx hardhat node
```

## ✅ CHECKLIST
- [ ] git pull exitoso
- [ ] npm install sin errores
- [ ] npm test = 22 passing
- [ ] node test-frontend.js exitoso
- [ ] Leer FRONTEND_INTEGRATION.md

**¡Ya puedes empezar a desarrollar el frontend! Todo está listo y probado.** 🎉
