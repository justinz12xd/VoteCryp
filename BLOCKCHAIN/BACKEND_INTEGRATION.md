# 🏗️ BLOCKCHAIN API PARA BACKEND CUSTODIAL

## 🎯 ARQUITECTURA NUEVA

```
Usuario (Cédula) → Backend API → Blockchain Contract
                      ↑              ↑
                 Wallet custodial   Tu contrato
                 (Backend maneja)   (Ya listo)
```

## 📝 RESPONSABILIDADES

### 🔗 **TU (Blockchain):**
- ✅ Smart contract funcionando
- ✅ API de integración para backend (`backend-blockchain-api.js`)
- ✅ Deploy en testnet/mainnet
- ✅ Documentación técnica

### 💻 **Backend (Tu compañero):**
- 🔄 Generar wallets custodiales para usuarios
- 🔄 Guardar private keys encriptadas
- 🔄 API REST para frontend (cédula + código)
- 🔄 Firmar transacciones en nombre del usuario

### 🖥️ **Frontend (Otro compañero):**
- 🔄 UI para login con cédula
- 🔄 Llamadas a backend API
- 🔄 No más MetaMask

## 🛠️ NUEVA API PARA BACKEND

### Archivos principales:
- `backend-blockchain-api.js` - API principal para backend
- `test-backend.js` - Test de wallets custodiales
- `contract-config.js` - Configuración (mismo de antes)

## 🔧 EJEMPLO DE USO PARA BACKEND

```javascript
const BackendBlockchainAPI = require('./backend-blockchain-api.js');

// 1. Generar wallet custodial para nuevo usuario
const custodialWallet = BackendBlockchainAPI.generateCustodialWallet();
// Guardar custodialWallet.privateKey encriptado en BD

// 2. Inicializar API con wallet del usuario
const userAPI = new BackendBlockchainAPI(userPrivateKey, 'liskSepolia');
await userAPI.initialize();

// 3. Registrar ENS automáticamente
await userAPI.registerENSForUser('usuario12345.eth');

// 4. Votar en nombre del usuario
await userAPI.voteForUser(electionId, optionIndex);
```

## 🚀 VENTAJAS DEL NUEVO SISTEMA

### ✅ Para el Usuario:
- ✅ Solo necesita cédula + código
- ✅ No necesita MetaMask
- ✅ No necesita saber de crypto
- ✅ Experiencia UX simple

### ✅ Para el Backend:
- ✅ Control total de wallets
- ✅ Gestión automática de gas
- ✅ Transacciones confiables
- ✅ API simple para usar

### ✅ Para el Sistema:
- ✅ Más seguro (no depende del usuario)
- ✅ Más rápido (no confirmaciones manuales)
- ✅ Escalable (batch transactions)
- ✅ Auditable (logs centralizados)

## 📊 FLUJO COMPLETO

### 1. **Registro de Usuario**
```
Usuario → Backend: POST /register { cedula, codigo }
Backend → Blockchain: generateCustodialWallet()
Backend → BD: guardar privateKey encriptada
Backend → Blockchain: registerENSForUser()
Backend → Usuario: "Registrado exitosamente"
```

### 2. **Votar**
```
Usuario → Backend: POST /vote { cedula, codigo, electionId, option }
Backend → BD: obtener privateKey del usuario
Backend → Blockchain: voteForUser(electionId, option)
Backend → Usuario: "Voto registrado"
```

### 3. **Ver Resultados**
```
Usuario → Backend: GET /results/electionId
Backend → Blockchain: getResults(electionId)
Backend → Usuario: resultados formateados
```

## 🧪 TESTING

### Test completo para backend:
```bash
# Ejecutar test de wallets custodiales
node test-backend.js
```

**✅ Debería ver:**
- Wallet custodial generada
- ENS registrado automáticamente
- Voto en nombre del usuario
- Prevención de double voting
- Consulta de resultados

## 🔒 SEGURIDAD

### ⚠️ Importante para tu compañero de backend:
1. **Encriptar private keys** en base de datos
2. **Usar HSM** para claves sensibles (producción)
3. **Rate limiting** en APIs
4. **Logs de auditoría** para todas las transacciones
5. **Backup seguro** de wallets

## 📱 PRÓXIMOS PASOS

### Para ti (Blockchain):
- [x] Smart contract listo
- [x] API para backend creada
- [x] Tests funcionando
- [ ] Deploy en Lisk Sepolia (cuando tengas ETH)

### Para tu compañero (Backend):
- [ ] Implementar generación de wallets
- [ ] Encriptar storage de private keys
- [ ] API REST para frontend
- [ ] Integrar con `backend-blockchain-api.js`

**🎉 Tu parte está 100% lista para el backend custodial!**
