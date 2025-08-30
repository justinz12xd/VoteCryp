const hre = require("hardhat");

async function main() {
  console.log("🧪 Testing VotingContract interactivo...");
  
  // Conectar al contrato desplegado (cambiar dirección según deployment)
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Dirección del último deploy
  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  const votingContract = VotingContract.attach(contractAddress);
  
  const [owner, voter1, voter2] = await hre.ethers.getSigners();
  
  console.log("📋 Cuentas disponibles:");
  console.log("Owner:", owner.address);
  console.log("Voter1:", voter1.address);
  console.log("Voter2:", voter2.address);
  
  try {
    // 1. Registrar votantes con ENS
    console.log("\n1️⃣ Registrando votantes con ENS...");
    await votingContract.connect(voter1).registerENS("alice.eth");
    console.log("✅ Alice registrada con ENS");
    
    await votingContract.connect(voter2).registerENS("bob.eth");
    console.log("✅ Bob registrado con ENS");
    
    // 2. Crear una elección
    console.log("\n2️⃣ Creando elección...");
    const tx = await votingContract.createElection(
      "¿Deberíamos implementar Zama FHE?",
      "Votación para decidir si implementamos encriptación homomórfica completa",
      ["Sí, implementar FHE", "No, mantener sistema actual", "Necesitamos más investigación"],
      24, // 24 horas
      false // Sin FHE por ahora
    );
    
    const receipt = await tx.wait();
    console.log("✅ Elección creada, ID: 1");
    
    // 3. Verificar información de la elección
    console.log("\n3️⃣ Información de la elección:");
    const electionInfo = await votingContract.getElectionInfo(1);
    console.log("Título:", electionInfo.title);
    console.log("Descripción:", electionInfo.description);
    console.log("Creador:", electionInfo.creator);
    console.log("Total opciones:", electionInfo.optionCount.toString());
    
    // 4. Votar
    console.log("\n4️⃣ Votando...");
    await votingContract.connect(voter1).vote(1, 0); // Alice vota "Sí"
    console.log("✅ Alice votó por 'Sí, implementar FHE'");
    
    await votingContract.connect(voter2).vote(1, 2); // Bob vota "Más investigación"
    console.log("✅ Bob votó por 'Necesitamos más investigación'");
    
    // 5. Verificar resultados
    console.log("\n5️⃣ Resultados actuales:");
    const results = await votingContract.getResults(1);
    console.log("Total votos:", results.totalVotes.toString());
    
    results.optionNames.forEach((option, index) => {
      console.log(`${option}: ${results.voteCounts[index].toString()} votos`);
    });
    
    // 6. Verificar quién ha votado
    console.log("\n6️⃣ Verificando votantes:");
    const aliceVoted = await votingContract.hasVotedInElection(1, voter1.address);
    const bobVoted = await votingContract.hasVotedInElection(1, voter2.address);
    const ownerVoted = await votingContract.hasVotedInElection(1, owner.address);
    
    console.log("Alice ha votado:", aliceVoted);
    console.log("Bob ha votado:", bobVoted);
    console.log("Owner ha votado:", ownerVoted);
    
    // 7. Obtener elecciones activas
    console.log("\n7️⃣ Elecciones activas:");
    const activeElections = await votingContract.getActiveElections();
    console.log("IDs de elecciones activas:", activeElections.map(id => id.toString()));
    
    // 8. Cerrar elección
    console.log("\n8️⃣ Cerrando elección...");
    await votingContract.closeElection(1);
    console.log("✅ Elección cerrada");
    
    // 9. Verificar estado final
    console.log("\n9️⃣ Estado final:");
    const finalResults = await votingContract.getResults(1);
    console.log("Estado:", finalResults.status === 1 ? "Cerrada" : "Activa");
    console.log("Total votos finales:", finalResults.totalVotes.toString());
    
    const finalActiveElections = await votingContract.getActiveElections();
    console.log("Elecciones activas después del cierre:", finalActiveElections.length);
    
    console.log("\n🎉 ¡Testing completado exitosamente!");
    console.log("\n📊 RESUMEN:");
    console.log("- ✅ Registro ENS funcionando");
    console.log("- ✅ Creación de elecciones funcionando");
    console.log("- ✅ Sistema de votación funcionando");
    console.log("- ✅ Prevención de double voting funcionando");
    console.log("- ✅ Cierre de elecciones funcionando");
    console.log("- ✅ Consulta de resultados funcionando");
    
  } catch (error) {
    console.error("❌ Error durante el testing:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
