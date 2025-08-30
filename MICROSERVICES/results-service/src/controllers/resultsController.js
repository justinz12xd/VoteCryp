export function createResultsController(service) {
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
    decryptResults: handle(async (req) => service.decryptResults(req.body || {})),
  };
}
