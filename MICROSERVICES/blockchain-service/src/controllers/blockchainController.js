export function createBlockchainController(service) {
  const handle = (fn) => async (req, res) => {
    try {
      const result = await fn(req, res);
      res.json(result);
    } catch (e) {
      const status = e.status || 500;
      const msg = status === 500 ? e.message || "internal error" : e.message;
      res.status(status).json({ error: msg });
    }
  };

  return {
    health: handle(async () => service.health()),
    hasVoted: handle(async (req) =>
      service.hasVoted(req.query.electionId, req.query.address)
    ),
    submitVote: handle(async (req) => service.submitVote(req.body || {})),
    getEncryptedResults: handle(async () => service.getEncryptedResults()),
    createElection: handle(async (req) =>
      service.createElection(req.body || {})
    ),
    closeElection: handle(async (req) => service.closeElection(req.body || {})),
    activeElections: handle(async () => service.getActiveElections()),
    electionInfo: handle(async (req) =>
      service.getElectionInfo(req.query.electionId)
    ),
    contractResults: handle(async (req) =>
      service.getContractResults(req.query.electionId)
    ),
    getENSVoter: handle(async (req) => service.getENSVoter(req.query.address)),
    registerENSWithPK: handle(async (req) =>
      service.registerENSWithPK(req.body || {})
    ),
    // quick helper: /createElectionQuick?title=...&options=Alice,Bob&durationHours=2&enableFHE=false
    createElectionQuick: handle(async (req) => {
      const q = req.query || {};
      const options = String(q.options || "").split(",").filter(Boolean);
      const body = {
        title: q.title || "Quick Election",
        description: q.description || "",
        options,
        durationHours: Number(q.durationHours || 2),
        enableFHE: String(q.enableFHE || "false").toLowerCase() === "true",
      };
      return service.createElection(body);
    }),
  };
}
