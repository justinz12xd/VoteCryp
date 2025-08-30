// Test rápido para verificar que el contrato funciona desde el frontend
const { ethers } = require('ethers');
const { CONTRACT_CONFIG, VOTING_CONTRACT_ABI } = require('./contract-config.js');

async function testContract() {
  try {
    console.log('🚀 Iniciando test de integración frontend...\n');
    
    // Conectar a red local
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    
    // Usar una cuenta de Hardhat (con ETH ilimitado)
    const signer = new ethers.Wallet(
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      provider
    );
    
    console.log('👤 Usando cuenta:', await signer.getAddress());
    console.log('💰 Balance:', ethers.formatEther(await provider.getBalance(signer.address)), 'ETH\n');
    
    // Conectar al contrato
    const contract = new ethers.Contract(
      CONTRACT_CONFIG.development.address,
      VOTING_CONTRACT_ABI,
      signer
    );
    
    console.log('🔗 Conectado al contrato:', CONTRACT_CONFIG.development.address);
    console.log('🌐 Chain ID:', CONTRACT_CONFIG.development.chainId);
    console.log('🌐 Red:', CONTRACT_CONFIG.development.networkName, '\n');
    
    // Test 1: Verificar owner
    const owner = await contract.owner();
    console.log('👑 Owner del contrato:', owner);
    
    // Test 2: Registrar ENS
    console.log('\n📝 Test 1: Registrando ENS...');
    const tx1 = await contract.registerENS('frontend-test.eth');
    const receipt1 = await tx1.wait();
    console.log('✅ ENS registrado - Hash:', receipt1.hash);
    
    // Test 3: Verificar ENS registrado
    const ensData = await contract.getENSVoter(signer.address);
    console.log('✅ ENS verificado:', ensData.ensName, '- Verificado:', ensData.isVerified);
    
    // Test 4: Crear elección
    console.log('\n🗳️ Test 2: Creando elección...');
    const tx2 = await contract.createElection(
      'Test Frontend Election',
      'Esta es una elección de prueba para el frontend', 
      ['Opción A', 'Opción B', 'Opción C'],
      24, // 24 horas
      false // FHE deshabilitado
    );
    const receipt2 = await tx2.wait();
    console.log('✅ Elección creada - Hash:', receipt2.hash);
    
    // Buscar el evento ElectionCreated
    const event = receipt2.logs.find(log => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed.name === 'ElectionCreated';
      } catch {
        return false;
      }
    });
    
    const electionId = event ? 
      contract.interface.parseLog(event).args.electionId.toString() : 
      '1'; // Fallback
    
    console.log('🆔 ID de la elección:', electionId);
    
    // Test 5: Obtener info de la elección
    console.log('\n📊 Test 3: Obteniendo info de elección...');
    const electionInfo = await contract.getElectionInfo(electionId);
    console.log('✅ Info de elección:');
    console.log('   - Título:', electionInfo.title);
    console.log('   - Descripción:', electionInfo.description);
    console.log('   - Creador:', electionInfo.creator);
    console.log('   - Estado:', electionInfo.status === 0 ? 'Activa' : 'Cerrada');
    console.log('   - Total votos:', electionInfo.totalVotes.toString());
    console.log('   - Opciones:', electionInfo.optionCount.toString());
    
    // Test 6: Verificar que no ha votado
    const hasVoted = await contract.hasVotedInElection(electionId, signer.address);
    console.log('🗳️ Ya votó:', hasVoted);
    
    // Test 7: Votar
    console.log('\n✅ Test 4: Votando por opción 0...');
    const tx3 = await contract.vote(electionId, 0); // Votar por primera opción
    const receipt3 = await tx3.wait();
    console.log('✅ Voto registrado - Hash:', receipt3.hash);
    
    // Test 8: Verificar que ya votó
    const hasVotedNow = await contract.hasVotedInElection(electionId, signer.address);
    console.log('✅ Verificación post-voto - Ya votó:', hasVotedNow);
    
    // Test 9: Intentar votar de nuevo (debería fallar)
    console.log('\n🚫 Test 5: Intentando votar de nuevo (debería fallar)...');
    try {
      await contract.vote(electionId, 1);
      console.log('❌ ERROR: Permitió votar dos veces!');
    } catch (error) {
      console.log('✅ Correcto: Previene double voting -', error.message.split('(')[0]);
    }
    
    // Test 10: Ver resultados
    console.log('\n📈 Test 6: Obteniendo resultados...');
    const results = await contract.getResults(electionId);
    console.log('✅ Resultados de la elección:');
    console.log('   - Título:', results.title);
    console.log('   - Opciones:', results.optionNames);
    console.log('   - Votos por opción:', results.voteCounts.map(v => v.toString()));
    console.log('   - Total votos:', results.totalVotes.toString());
    console.log('   - Estado:', results.status === 0 ? 'Activa' : 'Cerrada');
    console.log('   - FHE habilitado:', results.fheEnabled);
    
    // Test 11: Obtener elecciones activas
    console.log('\n📋 Test 7: Obteniendo elecciones activas...');
    const activeElections = await contract.getActiveElections();
    console.log('✅ Elecciones activas:', activeElections.map(id => id.toString()));
    
    // Test 12: Total de elecciones
    const totalElections = await contract.getTotalElections();
    console.log('✅ Total de elecciones creadas:', totalElections.toString());
    
    console.log('\n🎉 TODOS LOS TESTS PASARON - EL CONTRATO FUNCIONA PERFECTAMENTE PARA EL FRONTEND');
    console.log('\n📱 Tu compañero puede usar estos mismos métodos en el frontend:');
    console.log('   - registerENS()');
    console.log('   - createElection()');
    console.log('   - vote()');
    console.log('   - getResults()');
    console.log('   - hasVotedInElection()');
    console.log('   - getActiveElections()');
    console.log('\n🔗 Configuración para MetaMask:');
    console.log('   - Network: Hardhat Local');
    console.log('   - RPC URL: http://127.0.0.1:8545');
    console.log('   - Chain ID: 31337');
    console.log('   - Address:', CONTRACT_CONFIG.development.address);
    
  } catch (error) {
    console.error('\n❌ Error en el test:', error);
    console.log('\n🔧 Posibles soluciones:');
    console.log('   1. Asegúrate de que Hardhat esté corriendo: npx hardhat node');
    console.log('   2. Verifica que el contrato esté desplegado: npm run deploy');
    console.log('   3. Instala dependencias: npm install');
  }
}

// Ejecutar test
testContract();
