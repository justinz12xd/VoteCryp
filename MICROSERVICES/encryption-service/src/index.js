import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// health
app.get("/health", (_req, res) => res.json({ ok: true }));

// POST /encryptVote { candidateIndex, electionId }
app.post("/encryptVote", async (req, res) => {
  const { candidateIndex, electionId } = req.body || {};
  if (typeof candidateIndex !== "number" || !electionId) {
    return res.status(400).json({ error: "invalid body" });
  }
  // Simulate Zama FHE encryption
  await new Promise((r) => setTimeout(r, 500));
  const encryptedVote = `zama_fhe_${electionId}_${candidateIndex}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2)}`;
  res.json({ encryptedVote });
});

// POST /tallyVotes { encryptedVotes: string[] }
app.post("/tallyVotes", async (req, res) => {
  const { encryptedVotes } = req.body || {};
  if (!Array.isArray(encryptedVotes))
    return res.status(400).json({ error: "invalid body" });
  // Simulate homomorphic tally
  await new Promise((r) => setTimeout(r, 600));
  res.json({ tallyEncrypted: `zama_fhe_tally_${encryptedVotes.length}` });
});

const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`encryption-service on :${port}`));
