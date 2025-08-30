const hre = require("hardhat");

async function main() {
  console.log("🔧 Debug del VotingContract...");
  
  // Conectar al contrato desplegado
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  const votingContract = VotingContract.attach(contractAddress);
  
  const [owner, voter1, voter2] = await hre.ethers.getSigners();
  
  try {
    // Test básico: verificar que el contrato funciona
    console.log("📊 Total de elecciones:", await votingContract.getTotalElections());
    console.log("🗳️  Elecciones activas:", (await votingContract.getActiveElections()).length);
    
    // Registrar votantes
    console.log("\n1️⃣ Registrando votantes...");
    await votingContract.connect(voter1).registerENS("alice.eth");
    await votingContract.connect(voter2).registerENS("bob.eth");
    console.log("✅ Votantes registrados");
    
    // Crear elección simple
    console.log("\n2️⃣ Creando elección simple...");
    const tx = await votingContract.createElection(
      "Test Simple",
      "Una prueba simple",
      ["Si", "No"],
      24,
      false
    );
    await tx.wait();
    console.log("✅ Elección creada");
    
    // Verificar creación
    console.log("\n3️⃣ Verificando creación...");
    console.log("Total elecciones:", await votingContract.getTotalElections());
    console.log("Elecciones activas:", (await votingContract.getActiveElections()).length);
    
    // Probar getResults directamente
    console.log("\n4️⃣ Obteniendo resultados...");
    const results = await votingContract.getResults(1);
    console.log("Título:", results.title);
    console.log("Descripción:", results.description);
    console.log("Opciones:", results.optionNames);
    console.log("Total votos:", results.totalVotes.toString());
    
    // Votar
    console.log("\n5️⃣ Votando...");
    await votingContract.connect(voter1).vote(1, 0);
    await votingContract.connect(voter2).vote(1, 1);
    console.log("✅ Votos emitidos");
    
    // Resultados finales
    console.log("\n6️⃣ Resultados finales...");
    const finalResults = await votingContract.getResults(1);
    console.log("Total votos:", finalResults.totalVotes.toString());
    finalResults.optionNames.forEach((option, index) => {
      console.log(`${option}: ${finalResults.voteCounts[index].toString()} votos`);
    });
    
    console.log("\n🎉 ¡Debug completado exitosamente!");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Stack:", error.stack);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
