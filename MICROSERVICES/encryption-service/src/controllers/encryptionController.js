export function createEncryptionController(service) {
  const handle = (fn) => async (req, res) => {
    try {
      const result = await fn(req, res);
      res.json(result);
    } catch (e) {
      const status = e.status || 500;
      res.status(status).json({ error: e.message || "internal error" });
    }
  };

  return {
    health: handle(async () => service.health()),
    encryptVote: handle(async (req) => service.encryptVote(req.body || {})),
    tallyVotes: handle(async (req) => service.tallyVotes(req.body || {})),
  };
}
