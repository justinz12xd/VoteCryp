const hre = require("hardhat");

async function main() {
  console.log("🚀 Iniciando deploy del VotingContract...");
  console.log("📡 Red:", hre.network.name);
  
  // Obtener signers
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("📝 Desplegando con la cuenta:", deployer.address);
  console.log("💰 Balance de la cuenta:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)));

  // Deploy del contrato
  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  
  console.log("⏳ Desplegando VotingContract...");
  const votingContract = await VotingContract.deploy();
  
  await votingContract.waitForDeployment();
  
  console.log("✅ VotingContract desplegado en:", await votingContract.getAddress());
  console.log("🔗 Hash de transacción:", votingContract.deploymentTransaction().hash);
  
  // Verificar que el contrato funcione
  console.log("🔍 Verificando funcionalidad básica...");
  
  try {
    const totalElections = await votingContract.getTotalElections();
    console.log("📊 Total de elecciones inicial:", totalElections.toString());
    
    const activeElections = await votingContract.getActiveElections();
    console.log("🗳️  Elecciones activas:", activeElections.length);
    
    // Obtener información del owner
    const owner = await votingContract.owner();
    console.log("👤 Owner del contrato:", owner);
    
  } catch (error) {
    console.error("❌ Error verificando funcionalidad:", error.message);
  }
  
  console.log("\n🎉 Deploy completado exitosamente!");
  console.log("\n📋 INFORMACIÓN PARA EL FRONTEND:");
  console.log("=".repeat(50));
  console.log("Dirección del contrato:", await votingContract.getAddress());
  console.log("Red:", hre.network.name);
  console.log("Chain ID:", hre.network.config.chainId || "N/A");
  console.log("Deployer:", deployer.address);
  console.log("=".repeat(50));
  
  console.log("\n📝 PRÓXIMOS PASOS:");
  console.log("1. Guarda la dirección del contrato para el frontend");
  console.log("2. Registra tu ENS con: registerENS('tu-nombre.eth')");
  console.log("3. Crea una elección con: createElection(...)");
  console.log("4. Conecta el frontend a esta dirección");
  
  // Guardar información de deploy
  const deploymentInfo = {
    contractAddress: await votingContract.getAddress(),
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    blockNumber: votingContract.deploymentTransaction().blockNumber,
    transactionHash: votingContract.deploymentTransaction().hash,
    timestamp: new Date().toISOString(),
    gasUsed: votingContract.deploymentTransaction().gasLimit?.toString() || "N/A"
  };
  
  console.log("\n📁 Deployment Info (para logs):");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  return votingContract;
}

// Ejecutar el deploy
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error durante el deploy:", error);
    process.exit(1);
  });
