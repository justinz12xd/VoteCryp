# VoteCryp Blockchain - Sistema Custodial

Sistema de votación descentralizada con **wallets custodiales** para backend, integración ENS y preparado para Zama FHE.

## �️ Arquitectura Custodial

```
👤 Usuario              💻 Backend              🔗 Blockchain
(Cédula + Código)   →   (Wallet custodial)  →   (Smart Contract)
```

**El backend maneja las wallets automáticamente. Los usuarios solo necesitan cédula + código.**

## 🎯 Funciones del Smart Contract

✅ **createElection(...)** - Crear nuevas elecciones  
✅ **vote(electionId, option)** - Emitir votos con control de unicidad  
✅ **closeElection(electionId)** - Cerrar elecciones  
✅ **getResults(electionId)** - Obtener resultados en tiempo real  
✅ **Control de unicidad ENS + dirección** - Prevenir double voting  
✅ **API para backend custodial** - Manejo automático de wallets  

## 🚀 Setup para Blockchain

### Opción 1: Script Automático (Windows)
```powershell
.\setup.ps1
```

### Opción 2: Manual
```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo de configuración
cp .env.example .env

# 3. Compilar contratos
npm run compile

# 4. Ejecutar tests
npm test

# 5. Test backend custodial
node test-backend.js
```

## 🔧 Configuración para Deploy

1. **Editar `.env`** con tu private key:
```env
PRIVATE_KEY=tu_private_key_sin_0x_prefix
```

2. **Obtener testnet ETH**:
   - **Lisk Sepolia**: https://app.optimism.io/faucet
   - **Ethereum Sepolia**: https://sepoliafaucet.com

## 🌐 Deploy en Testnet

### Recomendado: Lisk Sepolia (Más barato)
```bash
npm run deploy:lisk
```

### Alternativa: Ethereum Sepolia
```bash
npm run deploy:sepolia
```

### Deploy Local (para desarrollo)
```bash
# Terminal 1 - Iniciar nodo local
npm run node

# Terminal 2 - Deploy
npm run deploy
```

## 📊 Información de Redes

| Red | Chain ID | RPC URL | Explorer |
|-----|----------|---------|----------|
| Lisk Sepolia | 4202 | https://rpc.sepolia-api.lisk.com | https://sepolia-blockscout.lisk.com |
| Ethereum Sepolia | 11155111 | https://sepolia.infura.io/v3/... | https://sepolia.etherscan.io |

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests con reporte de gas
REPORT_GAS=true npm test

# Coverage de tests
npm run coverage
```

## 📋 API para Backend Custodial

### 🔧 Inicialización para Backend
```javascript
const BackendBlockchainAPI = require('./backend-blockchain-api.js');

// 1. Generar wallet custodial para nuevo usuario
const custodialWallet = BackendBlockchainAPI.generateCustodialWallet();
// Guardar custodialWallet.privateKey encriptada en BD

// 2. Inicializar API con wallet del usuario
const userAPI = new BackendBlockchainAPI(userPrivateKey, 'liskSepolia');
await userAPI.initialize();
```

### 📝 Funciones para Backend

#### 1. Registrar ENS Automáticamente
```javascript
await userAPI.registerENSForUser("usuario12345.eth");
```

#### 2. Crear Elección (Admin)
```javascript
const result = await adminAPI.createElection(
  "Título de la Elección",
  "Descripción detallada",
  ["Opción A", "Opción B", "Opción C"],
  24 // Duración en horas
);
```

#### 3. Votar en Nombre del Usuario
```javascript
await userAPI.voteForUser(electionId, optionIndex);
```

#### 4. Obtener Resultados
```javascript
const results = await adminAPI.getResults(electionId);
```

#### 5. Verificar si Usuario Ya Votó
```javascript
const hasVoted = await userAPI.hasVoted(electionId, userAddress);
```

## 🔐 Seguridad para Backend

⚠️ **CRÍTICO para el backend:**
- **Encriptar private keys** en base de datos
- **Rate limiting** en todas las APIs
- **Validación de cédulas** reales
- **Logs de auditoría** completos
- **Backup seguro** de wallets custodiales

## 🔐 Seguridad Implementada

- ✅ **Control de unicidad**: ENS + dirección blockchain
- ✅ **ReentrancyGuard**: Prevención de ataques de reentrancy
- ✅ **Access Control**: Solo owner puede funciones administrativas
- ✅ **Validación de inputs**: Validación completa de parámetros
- ✅ **Time validation**: Control de períodos de votación

## 🔮 Integración Futura con Zama FHE

El contrato está preparado para integración con Zama:

```solidity
// Estructura lista para FHE
struct VoteOption {
    string name;
    uint256 voteCount;
    bytes encryptedResults; // ← Para Zama FHE
}

// Flag para habilitar FHE por elección
bool fheEnabled;

// Función para actualizar resultados cifrados
function updateEncryptedResults(
    uint256 electionId,
    uint256 optionIndex,
    bytes memory encryptedData
) external onlyOwner;
```

### Esquema de Integración FHE:

1. **Frontend** → Cifra voto con Zama client-side
2. **Smart Contract** → Almacena voto cifrado
3. **Zama Service** → Procesa votos cifrados off-chain
4. **Smart Contract** → Actualiza resultados mediante `updateEncryptedResults()`

## 🔌 Flujo de Integración Backend

### 1. **Registro de Usuario**
```
Usuario → Backend: POST /register { cedula, codigo }
Backend → Blockchain: generateCustodialWallet()
Backend → BD: guardar privateKey encriptada
Backend → Blockchain: registerENSForUser()
```

### 2. **Votación**
```
Usuario → Backend: POST /vote { cedula, codigo, electionId, option }
Backend → BD: obtener privateKey del usuario
Backend → Blockchain: voteForUser(electionId, option)
```

### 3. **Consulta de Resultados**
```
Usuario → Backend: GET /results/electionId
Backend → Blockchain: getResults(electionId)
Backend → Usuario: resultados formateados
```

## 📱 Testing Backend Custodial

```bash
# Test completo del sistema custodial
node test-backend.js
```

**✅ El test verifica:**
- Generación de wallets custodiales
- Registro ENS automático
- Votación en nombre del usuario
- Prevención de double voting
- Consulta de resultados

## 🎯 Para el Equipo Backend

### Archivos principales:
- **`backend-blockchain-api.js`** - API completa para backend
- **`BACKEND_INTEGRATION.md`** - Documentación detallada
- **`test-backend.js`** - Tests del sistema custodial
- **`RESUMEN_BACKEND_CUSTODIAL.md`** - Resumen ejecutivo

## 🐛 Troubleshooting

### Error: "insufficient funds for intrinsic transaction cost"
- El backend necesita ETH en las wallets custodiales
- Usa los faucets mencionados arriba para fundear wallets

### Error: "nonce too high"
- Resetea la wallet en MetaMask: Configuración → Avanzado → Resetear cuenta

### Error: "execution reverted"
- Verifica que el ENS esté registrado antes de votar
- Verifica que la elección esté activa
- Revisa que el usuario no haya votado ya

### Error: "Contract not deployed"
- Ejecuta `npm run deploy` o `npm run deploy:lisk`

## 🤝 Para el Equipo

### **Backend Developer necesita:**
1. **`backend-blockchain-api.js`** - API principal
2. **Configuración de red** - En `contract-config.js`
3. **Address del contrato** - Después del deploy
4. **Documentación** - En `BACKEND_INTEGRATION.md`

### **Frontend Developer necesita:**
1. **API REST del backend** - Para login con cédula
2. **No necesita** conexión directa a blockchain
3. **No necesita** MetaMask ni wallets

## 📈 Próximas Mejoras

- [ ] Integración completa con Zama FHE
- [ ] Sistema de delegation de votos
- [ ] Votación ranked choice
- [ ] Sistema de governance
- [ ] Integración con ENS registry real
- [ ] Optimizaciones de gas

---

**¿Listo para deployar?** 🚀

Ejecuta `.\setup.ps1` y luego `npm run deploy:lisk` para tener tu contrato funcionando en minutos.
