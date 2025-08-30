# 🧪 TEST DE INTEGRACIÓN FRONTEND

## 📦 Archivos principales para el frontend:

1. **`contract-config.js`** - Configuración de redes y ABI
2. **`voting-contract-api.js`** - API completa para el contrato
3. **`FRONTEND_INTEGRATION.md`** - Documentación

## 🚀 Test rápido para frontend:

### 1. **Verificar que Hardhat esté corriendo**
```bash
# En una terminal separada (mantener abierta)
cd BLOCKCHAIN
npx hardhat node
```
**✅ Debería ver:** `Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/`

### 2. **Test básico con Node.js**
Crear archivo `test-frontend.js`:

```javascript
// test-frontend.js
const { ethers } = require('ethers');
const { CONTRACT_CONFIG, VOTING_CONTRACT_ABI } = require('./contract-config.js');

async function testContract() {
  try {
    // Conectar a red local
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    
    // Usar una cuenta de Hardhat (con ETH)
    const signer = new ethers.Wallet(
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      provider
    );
    
    // Conectar al contrato
    const contract = new ethers.Contract(
      CONTRACT_CONFIG.development.address,
      VOTING_CONTRACT_ABI,
      signer
    );
    
    console.log('🔗 Conectado al contrato:', CONTRACT_CONFIG.development.address);
    
    // Test 1: Registrar ENS
    console.log('📝 Registrando ENS...');
    const tx1 = await contract.registerENS('test.eth');
    await tx1.wait();
    console.log('✅ ENS registrado');
    
    // Test 2: Crear elección
    console.log('🗳️ Creando elección...');
    const tx2 = await contract.createElection(
      'Test Election',
      'Test Description', 
      ['Option A', 'Option B'],
      24,
      false
    );
    const receipt = await tx2.wait();
    console.log('✅ Elección creada');
    
    // Test 3: Obtener total de elecciones
    const total = await contract.getTotalElections();
    console.log('📊 Total elecciones:', total.toString());
    
    // Test 4: Votar
    console.log('✅ Votando...');
    const tx3 = await contract.vote(1, 0); // Elección 1, opción 0
    await tx3.wait();
    console.log('✅ Voto registrado');
    
    // Test 5: Ver resultados
    console.log('📈 Obteniendo resultados...');
    const results = await contract.getResults(1);
    console.log('✅ Resultados:', {
      title: results.title,
      options: results.optionNames,
      votes: results.voteCounts.map(v => v.toString())
    });
    
    console.log('\n🎉 TODOS LOS TESTS PASARON - EL CONTRATO FUNCIONA PERFECTAMENTE');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testContract();
```

### 3. **Ejecutar test**
```bash
# Instalar ethers si no está
npm install ethers

# Ejecutar test
node test-frontend.js
```

**✅ Debería ver:**
```
🔗 Conectado al contrato: 0x5FbDB2315678afecb367f032d93F642f64180aa3
📝 Registrando ENS...
✅ ENS registrado
🗳️ Creando elección...
✅ Elección creada
📊 Total elecciones: 1
✅ Votando...
✅ Voto registrado
📈 Obteniendo resultados...
✅ Resultados: { title: 'Test Election', options: ['Option A', 'Option B'], votes: ['1', '0'] }

🎉 TODOS LOS TESTS PASARON - EL CONTRATO FUNCIONA PERFECTAMENTE
```

### 4. **Test con MetaMask (Frontend real)**
```javascript
// En tu componente React/Vue/etc
import VotingContractAPI from '../blockchain/voting-contract-api.js';

const api = new VotingContractAPI();

// Conectar MetaMask
await api.connect();

// Usar las funciones
await api.registerENS('usuario.eth');
await api.createElection('Mi Elección', 'Descripción', ['Sí', 'No'], 24);
```

## 🛠️ Configuración MetaMask para testing:

1. **Agregar red local:**
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency: `ETH`

2. **Importar cuenta de test:**
   - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - (Esta cuenta tiene ETH ilimitado en Hardhat)

## 🚨 Problemas comunes del frontend:

### Error: "Contract not deployed"
```bash
# Verificar que esté desplegado
npm run deploy
```

### Error: "Wrong network"
- Verificar que MetaMask esté en red local (31337)

### Error: "Insufficient funds"
- Usar la cuenta de Hardhat con ETH ilimitado

### Error: "Contract ABI"
- Verificar que esté importando correctamente el ABI

## ✅ Checklist para tu compañero:

- [ ] `git pull` exitoso
- [ ] `npm install` sin errores
- [ ] `npm test` = 22 passing
- [ ] `npm run deploy` exitoso
- [ ] `node test-frontend.js` exitoso
- [ ] MetaMask conecta a red local
- [ ] Puede llamar funciones del contrato

**¡Con esto tu compañero puede probar todo antes de empezar su desarrollo!**
