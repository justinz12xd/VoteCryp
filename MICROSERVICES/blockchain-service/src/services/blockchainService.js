export class BlockchainService {
  constructor(contract) {
    this.contract = contract;
    this.encryptedVotes = [];
  }

  async health() {
    return { ok: true };
  }

  async hasVoted(electionId, address) {
    const has = await this.contract.hasVotedInElection(electionId, address);
    return { hasVoted: Boolean(has) };
  }

  async submitVote({ electionId, encryptedVote, walletAddress }) {
    if (!electionId || !encryptedVote || !walletAddress)
      throw Object.assign(new Error("invalid body"), { status: 400 });

    const parts = String(encryptedVote).split("_");
    const optionIndex = Number(parts[3]) || 0;

    const tx = await this.contract.vote(electionId, optionIndex);
    const receipt = await tx.wait();

    this.encryptedVotes.push({ electionId, encryptedVote });
    return {
      txHash: receipt.hash,
      blockNumber: Number(receipt.blockNumber),
      confirmed: true,
    };
  }

  async getEncryptedResults() {
    return {
      encryptedResults: this.encryptedVotes.map((v) => v.encryptedVote),
    };
  }

  async createElection({
    title,
    description,
    options,
    durationHours,
    enableFHE,
  }) {
    if (
      !title ||
      !Array.isArray(options) ||
      options.length < 2 ||
      !durationHours
    ) {
      throw Object.assign(new Error("invalid body"), { status: 400 });
    }
    const tx = await this.contract.createElection(
      title,
      description || "",
      options,
      durationHours,
      Boolean(enableFHE)
    );
    const receipt = await tx.wait();
    let electionId = null;
    try {
      const event = receipt.logs.find((log) => {
        try {
          return (
            this.contract.interface.parseLog(log).name === "ElectionCreated"
          );
        } catch {
          return false;
        }
      });
      if (event) {
        electionId =
          this.contract.interface
            .parseLog(event)
            .args.electionId?.toString?.() || null;
      }
    } catch {}
    return { txHash: receipt.hash, electionId };
  }

  async closeElection({ electionId }) {
    if (!electionId)
      throw Object.assign(new Error("invalid body"), { status: 400 });
    const tx = await this.contract.closeElection(electionId);
    const receipt = await tx.wait();
    return { txHash: receipt.hash };
  }

  async getActiveElections() {
    const ids = await this.contract.getActiveElections();
    return { ids: ids.map((x) => Number(x)) };
  }

  async getElectionInfo(electionId) {
    if (!electionId)
      throw Object.assign(new Error("missing electionId"), { status: 400 });
    const info = await this.contract.getElectionInfo(electionId);
    return {
      title: info.title,
      description: info.description,
      creator: info.creator,
      startTime: Number(info.startTime),
      endTime: Number(info.endTime),
      status: Number(info.status),
      totalVotes: Number(info.totalVotes),
      optionCount: Number(info.optionCount),
    };
  }

  async getContractResults(electionId) {
    if (!electionId)
      throw Object.assign(new Error("missing electionId"), { status: 400 });
    const results = await this.contract.getResults(electionId);
    return {
      title: results.title,
      description: results.description,
      optionNames: results.optionNames,
      voteCounts: results.voteCounts.map((v) => Number(v)),
      totalVotes: Number(results.totalVotes),
      status: Number(results.status),
      fheEnabled: Boolean(results.fheEnabled),
    };
  }

  async getENSVoter(address) {
    if (!address)
      throw Object.assign(new Error("missing address"), { status: 400 });
    const info = await this.contract.getENSVoter(address);
    return {
      ensName: info.ensName || "",
      isVerified: Boolean(info.isVerified),
      registrationTime: Number(info.registrationTime || 0),
    };
  }

  async registerENSWithPK({ ensName, privateKey }) {
    if (!ensName || !privateKey)
      throw Object.assign(new Error("invalid body"), { status: 400 });
    // Reconnect contract with user signer to ensure tx is from user wallet
    const { ethers } = await import("ethers");
    const provider = this.contract.runner?.provider || this.contract.provider;
    const serviceSigner = this.contract.runner;
    const userSigner = new ethers.Wallet(privateKey, provider);

    // Auto-fund user if needed (useful for Hardhat dev network)
    try {
      const min = ethers.parseEther("0.1");
      const bal = await provider.getBalance(userSigner.address);
      if (bal < min && serviceSigner?.sendTransaction) {
        const fundTx = await serviceSigner.sendTransaction({
          to: userSigner.address,
          value: ethers.parseEther("1.0"),
        });
        await fundTx.wait();
      }
    } catch (e) {
      // ignore funding errors and proceed
    }
    const userContract = this.contract.connect(userSigner);
    const tx = await userContract.registerENS(ensName);
    const receipt = await tx.wait();
    return { txHash: receipt.hash, confirmed: true };
  }
}
