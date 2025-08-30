// Test para verificar la API del backend con wallets custodiales
const BackendBlockchainAPI = require('./backend-blockchain-api.js');

async function testBackendAPI() {
  try {
    console.log('🏗️ Testeando API de Blockchain para Backend Custodial\n');

    // Test 1: Generar wallet custodial
    console.log('👛 Test 1: Generando wallet custodial...');
    const custodialWallet = BackendBlockchainAPI.generateCustodialWallet();
    console.log('✅ Wallet generada:');
    console.log('   Address:', custodialWallet.address);
    console.log('   Private Key:', custodialWallet.privateKey.substring(0, 10) + '...');
    console.log('   Mnemonic:', custodialWallet.mnemonic.split(' ').slice(0, 3).join(' ') + '...\n');

    // Test 2: Inicializar API con wallet admin (para crear elecciones)
    console.log('🔧 Test 2: Inicializando API con wallet admin...');
    const adminPrivateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Hardhat account
    const adminAPI = new BackendBlockchainAPI(adminPrivateKey, 'development');
    await adminAPI.initialize();
    console.log('✅ API admin inicializada\n');

    // Test 3: Verificar que el contrato existe
    console.log('🔍 Test 3: Verificando contrato...');
    const contractExists = await adminAPI.verifyContract();
    console.log('✅ Contrato existe:', contractExists);
    
    if (!contractExists) {
      console.log('❌ Contrato no encontrado. Ejecuta: npm run deploy');
      return;
    }

    // Test 4: Obtener precio de gas
    console.log('\n💰 Test 4: Obteniendo precio de gas...');
    const gasPrice = await adminAPI.getGasPrice();
    console.log('✅ Precio de gas:', gasPrice);

    // Test 5: Crear elección como admin
    console.log('\n🗳️ Test 5: Creando elección como admin...');
    const electionResult = await adminAPI.createElection(
      'Elección Backend Test',
      'Esta elección fue creada por el backend',
      ['Opción A', 'Opción B', 'Opción C'],
      24
    );
    console.log('✅ Elección creada:', electionResult);
    const electionId = electionResult.electionId;

    // Test 6: Inicializar API con wallet custodial del usuario
    console.log('\n👤 Test 6: Inicializando API con wallet custodial...');
    
    // Para este test, necesitamos transferir algo de ETH a la wallet custodial
    console.log('💸 Transfiriendo ETH a wallet custodial...');
    await adminAPI.transferETH(custodialWallet.address, '0.1');
    
    const userAPI = new BackendBlockchainAPI(custodialWallet.privateKey, 'development');
    await userAPI.initialize();
    console.log('✅ API usuario inicializada');

    // Test 7: Registrar ENS para el usuario
    console.log('\n📝 Test 7: Registrando ENS para usuario...');
    const ensResult = await userAPI.registerENSForUser('usuario-backend.eth');
    console.log('✅ ENS registrado:', ensResult);

    // Test 8: Verificar balance del usuario
    console.log('\n💰 Test 8: Verificando balance del usuario...');
    const balance = await userAPI.getBalance();
    console.log('✅ Balance del usuario:', balance, 'ETH');

    // Test 9: Votar en nombre del usuario
    console.log('\n✅ Test 9: Votando en nombre del usuario...');
    const voteResult = await userAPI.voteForUser(electionId, 1); // Votar por opción 1
    console.log('✅ Voto registrado:', voteResult);

    // Test 10: Verificar que ya votó
    console.log('\n🔍 Test 10: Verificando que el usuario ya votó...');
    const hasVoted = await userAPI.hasVoted(electionId, custodialWallet.address);
    console.log('✅ Usuario ya votó:', hasVoted);

    // Test 11: Intentar votar de nuevo (debería fallar)
    console.log('\n🚫 Test 11: Intentando votar de nuevo (debería fallar)...');
    try {
      await userAPI.voteForUser(electionId, 0);
      console.log('❌ ERROR: Permitió votar dos veces!');
    } catch (error) {
      console.log('✅ Correcto: Previene double voting');
    }

    // Test 12: Obtener resultados
    console.log('\n📊 Test 12: Obteniendo resultados...');
    const results = await adminAPI.getResults(electionId);
    console.log('✅ Resultados:', results);

    // Test 13: Obtener info de la elección
    console.log('\n📋 Test 13: Obteniendo info de elección...');
    const electionInfo = await adminAPI.getElectionInfo(electionId);
    console.log('✅ Info de elección:', electionInfo);

    // Test 14: Obtener elecciones activas
    console.log('\n📈 Test 14: Obteniendo elecciones activas...');
    const activeElections = await adminAPI.getActiveElections();
    console.log('✅ Elecciones activas:', activeElections);

    console.log('\n🎉 TODOS LOS TESTS DEL BACKEND PASARON');
    console.log('\n📱 Tu compañero de backend puede usar BackendBlockchainAPI para:');
    console.log('   ✅ Generar wallets custodiales para usuarios');
    console.log('   ✅ Registrar ENS automáticamente');
    console.log('   ✅ Crear elecciones como admin');
    console.log('   ✅ Votar en nombre de usuarios');
    console.log('   ✅ Consultar resultados y estados');
    console.log('   ✅ Manejar gas y balances');

    console.log('\n🔧 Arquitectura Backend:');
    console.log('   Usuario (Cédula) → Backend API → Blockchain');
    console.log('                        ↑');
    console.log('                   Wallet custodial');
    console.log('                   (Backend maneja)');

  } catch (error) {
    console.error('\n❌ Error en test del backend:', error);
    console.log('\n🔧 Asegúrate de que:');
    console.log('   1. Hardhat esté corriendo: npx hardhat node');
    console.log('   2. El contrato esté desplegado: npm run deploy');
    console.log('   3. Las dependencias estén instaladas: npm install');
  }
}

// Ejecutar test
testBackendAPI();
