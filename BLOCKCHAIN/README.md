# VoteCryp Blockchain - Smart Contracts

Sistema de votación descentralizada con integración ENS y preparado para Zama FHE.

## 🎯 Funciones Principales Implementadas

✅ **createElection(...)** - Crear nuevas elecciones
✅ **vote(electionId, option)** - Emitir votos con control de unicidad
✅ **closeElection(electionId)** - Cerrar elecciones
✅ **getResults(electionId)** - Obtener resultados en tiempo real
✅ **Control de unicidad ENS + dirección** - Prevenir double voting

## 🚀 Setup Rápido

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

## 📋 Uso del Contrato

### 1. Registrar ENS (Obligatorio para votar)
```javascript
await votingContract.registerENS("mi-nombre.eth");
```

### 2. Crear Elección
```javascript
await votingContract.createElection(
  "Título de la Elección",
  "Descripción detallada",
  ["Opción A", "Opción B", "Opción C"], // Opciones de voto
  24, // Duración en horas
  false // Habilitar FHE (false por ahora)
);
```

### 3. Votar
```javascript
const electionId = 1;
const optionIndex = 0; // Votar por "Opción A"
await votingContract.vote(electionId, optionIndex);
```

### 4. Cerrar Elección
```javascript
await votingContract.closeElection(electionId);
```

### 5. Obtener Resultados
```javascript
const results = await votingContract.getResults(electionId);
console.log("Título:", results.title);
console.log("Total votos:", results.totalVotes.toString());
console.log("Resultados:", results.voteCounts.map(v => v.toString()));
```

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

## 🔌 Integración con Frontend

### Conectar con ethers.js:
```javascript
import { ethers } from 'ethers';
import VotingContractABI from './contracts/VotingContract.json';

const CONTRACT_ADDRESS = "0x..."; // Dirección del deploy
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const votingContract = new ethers.Contract(
  CONTRACT_ADDRESS,
  VotingContractABI.abi,
  signer
);

// Usar las funciones del contrato
await votingContract.registerENS("usuario.eth");
await votingContract.createElection(...);
```

## 📝 Eventos para el Frontend

El contrato emite eventos para que el frontend pueda escuchar:

```javascript
// Escuchar nueva elección
votingContract.on("ElectionCreated", (electionId, title, creator, startTime, endTime) => {
  console.log(`Nueva elección: ${title} (ID: ${electionId})`);
});

// Escuchar nuevo voto
votingContract.on("VoteCast", (electionId, voter, ensName, optionIndex, timestamp) => {
  console.log(`Nuevo voto en elección ${electionId} por ${ensName}`);
});

// Escuchar cierre de elección
votingContract.on("ElectionClosed", (electionId, totalVotes, timestamp) => {
  console.log(`Elección ${electionId} cerrada con ${totalVotes} votos`);
});
```

## 🐛 Troubleshooting

### Error: "insufficient funds for intrinsic transaction cost"
- Necesitas testnet ETH en tu wallet
- Usa los faucets mencionados arriba

### Error: "nonce too high"
- Reset tu wallet: Configuración → Avanzado → Resetear cuenta

### Error: "execution reverted"
- Verifica que tengas ENS registrado antes de votar
- Verifica que la elección esté activa
- Revisa que no hayas votado ya

## 🤝 Para el Frontend

Una vez deployado el contrato, necesitarás:

1. **Dirección del contrato**: Se mostrará después del deploy
2. **ABI del contrato**: Se genera en `artifacts/contracts/VotingContract.sol/VotingContract.json`
3. **Chain ID**: 4202 para Lisk Sepolia, 11155111 para Ethereum Sepolia

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
