const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingContract - Funciones Principales", function () {
  let VotingContract;
  let votingContract;
  let owner;
  let voter1;
  let voter2;
  let voter3;
  let addrs;

  beforeEach(async function () {
    // Obtener signers
    [owner, voter1, voter2, voter3, ...addrs] = await ethers.getSigners();

    // Deploy del contrato
    VotingContract = await ethers.getContractFactory("VotingContract");
    votingContract = await VotingContract.deploy();
    await votingContract.waitForDeployment();
  });

  describe("Deploy y configuración inicial", function () {
    it("Debe establecer el owner correcto", async function () {
      expect(await votingContract.owner()).to.equal(owner.address);
    });

    it("Debe iniciar con 0 elecciones", async function () {
      expect(await votingContract.getTotalElections()).to.equal(0);
    });

    it("Debe tener 0 elecciones activas", async function () {
      const activeElections = await votingContract.getActiveElections();
      expect(activeElections.length).to.equal(0);
    });
  });

  describe("Registro ENS", function () {
    it("Debe permitir registrar ENS", async function () {
      await votingContract.connect(voter1).registerENS("voter1.eth");
      
      const voterInfo = await votingContract.getENSVoter(voter1.address);
      expect(voterInfo.ensName).to.equal("voter1.eth");
      expect(voterInfo.isVerified).to.equal(true);
    });

    it("No debe permitir ENS vacío", async function () {
      await expect(
        votingContract.connect(voter1).registerENS("")
      ).to.be.revertedWith("ENS name cannot be empty");
    });

    it("No debe permitir registro duplicado", async function () {
      await votingContract.connect(voter1).registerENS("voter1.eth");
      
      await expect(
        votingContract.connect(voter1).registerENS("voter1-2.eth")
      ).to.be.revertedWith("Already registered");
    });

    it("No debe permitir ENS duplicado", async function () {
      await votingContract.connect(voter1).registerENS("voter1.eth");
      
      await expect(
        votingContract.connect(voter2).registerENS("voter1.eth")
      ).to.be.revertedWith("ENS name already taken");
    });
  });

  describe("createElection - Función Principal", function () {
    it("Debe crear elección correctamente", async function () {
      const title = "Elección de Prueba";
      const description = "Una elección para testing";
      const options = ["Opción A", "Opción B", "Opción C"];
      const duration = 24; // 24 horas
      const enableFHE = false;

      const tx = await votingContract.createElection(
        title,
        description,
        options,
        duration,
        enableFHE
      );

      // Verificar evento
      await expect(tx)
        .to.emit(votingContract, "ElectionCreated");

      // Verificar que se creó
      expect(await votingContract.getTotalElections()).to.equal(1);
      
      // Verificar información de la elección
      const electionInfo = await votingContract.getElectionInfo(1);
      expect(electionInfo.title).to.equal(title);
      expect(electionInfo.description).to.equal(description);
      expect(electionInfo.creator).to.equal(owner.address);
      expect(electionInfo.optionCount).to.equal(3);
    });

    it("No debe permitir título vacío", async function () {
      await expect(
        votingContract.createElection("", "Desc", ["A", "B"], 24, false)
      ).to.be.revertedWith("Title cannot be empty");
    });

    it("Debe requerir al menos 2 opciones", async function () {
      await expect(
        votingContract.createElection("Título", "Desc", ["Solo una"], 24, false)
      ).to.be.revertedWith("Must have at least 2 options");
    });

    it("Debe requerir duración positiva", async function () {
      await expect(
        votingContract.createElection("Título", "Desc", ["A", "B"], 0, false)
      ).to.be.revertedWith("Duration must be positive");
    });
  });

  describe("vote - Función Principal", function () {
    let electionId;

    beforeEach(async function () {
      // Registrar votantes
      await votingContract.connect(voter1).registerENS("voter1.eth");
      await votingContract.connect(voter2).registerENS("voter2.eth");
      
      // Crear elección
      await votingContract.createElection(
        "Test Election",
        "Testing voting",
        ["Option A", "Option B"],
        24, // 24 horas
        false // Sin FHE por ahora
      );
      electionId = 1;
    });

    it("Debe permitir votar a usuario registrado", async function () {
      const tx = await votingContract.connect(voter1).vote(electionId, 0);
      
      // Verificar evento
      await expect(tx)
        .to.emit(votingContract, "VoteCast");

      // Verificar que votó
      expect(await votingContract.hasVotedInElection(electionId, voter1.address)).to.equal(true);
      expect(await votingContract.hasENSVoted(electionId, "voter1.eth")).to.equal(true);
    });

    it("No debe permitir votar sin registro ENS", async function () {
      await expect(
        votingContract.connect(voter3).vote(electionId, 0)
      ).to.be.revertedWith("Must be verified with ENS");
    });

    it("No debe permitir double voting", async function () {
      await votingContract.connect(voter1).vote(electionId, 0);
      
      await expect(
        votingContract.connect(voter1).vote(electionId, 1)
      ).to.be.revertedWith("Address already voted");
    });

    it("No debe permitir opción inválida", async function () {
      await expect(
        votingContract.connect(voter1).vote(electionId, 999)
      ).to.be.revertedWith("Invalid option");
    });

    it("Debe incrementar contadores correctamente", async function () {
      await votingContract.connect(voter1).vote(electionId, 0);
      await votingContract.connect(voter2).vote(electionId, 1);

      const results = await votingContract.getResults(electionId);
      expect(results.totalVotes).to.equal(2);
      expect(results.voteCounts[0]).to.equal(1);
      expect(results.voteCounts[1]).to.equal(1);
    });
  });

  describe("closeElection - Función Principal", function () {
    let electionId;

    beforeEach(async function () {
      await votingContract.createElection(
        "Test Election",
        "Testing closing",
        ["Option A", "Option B"],
        24,
        false
      );
      electionId = 1;
    });

    it("Debe permitir al creador cerrar la elección", async function () {
      const tx = await votingContract.closeElection(electionId);
      
      await expect(tx)
        .to.emit(votingContract, "ElectionClosed");

      const electionInfo = await votingContract.getElectionInfo(electionId);
      expect(electionInfo.status).to.equal(1); // Closed status
    });

    it("No debe permitir a otros cerrar la elección", async function () {
      await expect(
        votingContract.connect(voter1).closeElection(electionId)
      ).to.be.revertedWith("Only creator or owner can close election");
    });

    it("No debe permitir cerrar elección ya cerrada", async function () {
      await votingContract.closeElection(electionId);
      
      await expect(
        votingContract.closeElection(electionId)
      ).to.be.revertedWith("Election already closed");
    });
  });

  describe("getResults - Función Principal", function () {
    let electionId;

    beforeEach(async function () {
      // Registrar votantes
      await votingContract.connect(voter1).registerENS("voter1.eth");
      await votingContract.connect(voter2).registerENS("voter2.eth");
      
      // Crear elección
      await votingContract.createElection(
        "Results Test",
        "Testing results",
        ["Candidate A", "Candidate B", "Candidate C"],
        24,
        false
      );
      electionId = 1;

      // Votar
      await votingContract.connect(voter1).vote(electionId, 0);
      await votingContract.connect(voter2).vote(electionId, 2);
    });

    it("Debe retornar resultados correctos", async function () {
      const results = await votingContract.getResults(electionId);
      
      expect(results.title).to.equal("Results Test");
      expect(results.description).to.equal("Testing results");
      expect(results.optionNames).to.deep.equal(["Candidate A", "Candidate B", "Candidate C"]);
      expect(results.voteCounts[0]).to.equal(1);
      expect(results.voteCounts[1]).to.equal(0);
      expect(results.voteCounts[2]).to.equal(1);
      expect(results.totalVotes).to.equal(2);
      expect(results.fheEnabled).to.equal(false);
    });

    it("Debe fallar para elección inexistente", async function () {
      await expect(
        votingContract.getResults(999)
      ).to.be.revertedWith("Election does not exist");
    });
  });

  describe("Integración de funciones principales", function () {
    it("Flujo completo: crear -> votar -> cerrar -> resultados", async function () {
      // 1. Registrar votantes
      await votingContract.connect(voter1).registerENS("alice.eth");
      await votingContract.connect(voter2).registerENS("bob.eth");

      // 2. Crear elección
      await votingContract.createElection(
        "Elección Completa",
        "Prueba de flujo completo",
        ["Si", "No"],
        24,
        false
      );
      const electionId = 1;

      // 3. Verificar elección activa
      let activeElections = await votingContract.getActiveElections();
      expect(activeElections.length).to.equal(1);
      expect(activeElections[0]).to.equal(electionId);

      // 4. Votar
      await votingContract.connect(voter1).vote(electionId, 0); // Si
      await votingContract.connect(voter2).vote(electionId, 1); // No

      // 5. Verificar resultados antes del cierre
      let results = await votingContract.getResults(electionId);
      expect(results.totalVotes).to.equal(2);
      expect(results.status).to.equal(0); // Active

      // 6. Cerrar elección
      await votingContract.closeElection(electionId);

      // 7. Verificar que ya no está activa
      activeElections = await votingContract.getActiveElections();
      expect(activeElections.length).to.equal(0);

      // 8. Verificar resultados finales
      results = await votingContract.getResults(electionId);
      expect(results.status).to.equal(1); // Closed
      expect(results.totalVotes).to.equal(2);
      expect(results.voteCounts[0]).to.equal(1); // Si
      expect(results.voteCounts[1]).to.equal(1); // No
    });
  });
});
