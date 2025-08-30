export class EncryptionService {
  async health() {
    return { ok: true };
  }

  async encryptVote({ candidateIndex, electionId }) {
    if (typeof candidateIndex !== "number" || !electionId) {
      throw Object.assign(new Error("invalid body"), { status: 400 });
    }
    await new Promise((r) => setTimeout(r, 500));
    const encryptedVote = `zama_fhe_${electionId}_${candidateIndex}_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`;
    return { encryptedVote };
  }

  async tallyVotes({ encryptedVotes }) {
    if (!Array.isArray(encryptedVotes)) {
      throw Object.assign(new Error("invalid body"), { status: 400 });
    }
    await new Promise((r) => setTimeout(r, 600));
    return { tallyEncrypted: `zama_fhe_tally_${encryptedVotes.length}` };
  }
}
