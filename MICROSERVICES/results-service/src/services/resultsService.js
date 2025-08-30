export class ResultsService {
  async health() {
    return { ok: true };
  }

  async decryptResults({ encryptedResults }) {
    if (!Array.isArray(encryptedResults)) {
      throw Object.assign(new Error("invalid body"), { status: 400 });
    }
    await new Promise((r) => setTimeout(r, 500));
    return { decryptedResults: [523, 412, 312], success: true };
  }
}
