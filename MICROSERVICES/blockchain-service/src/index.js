import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";

// In a real setup, reuse BLOCKCHAIN/contract-config.js directly or via package
import { VOTING_CONTRACT_ABI, CONTRACT_CONFIG } from "./contract-config.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Serve OpenAPI and Swagger UI
const openapiPath = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "../swagger.yaml"
);
app.get("/openapi.yaml", (_req, res) => {
  res.setHeader("Content-Type", "application/yaml");
  fs.createReadStream(openapiPath).pipe(res);
});
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, { swaggerUrl: "/openapi.yaml" })
);

// Select network config (Node environment: default to development unless env vars provided)
const netCfg = CONTRACT_CONFIG?.development || {
  rpcUrl: "http://127.0.0.1:8545",
  address: "",
};
const provider = new ethers.JsonRpcProvider(
  process.env.RPC_URL || netCfg.rpcUrl
);
const signer = new ethers.Wallet(
  process.env.PRIVATE_KEY || ethers.Wallet.createRandom().privateKey,
  provider
);
const contractAddress = process.env.CONTRACT_ADDRESS || netCfg.address;
const contract = new ethers.Contract(
  contractAddress,
  VOTING_CONTRACT_ABI,
  signer
);

// memory store of encrypted votes (until on-chain FHE storage is wired)
const encryptedVotes = [];

app.get("/health", (_req, res) => res.json({ ok: true }));

// Has voted check
app.get("/hasVoted", async (req, res) => {
  try {
    const { electionId, address } = req.query || {};
    if (!electionId || !address)
      return res.status(400).json({ error: "missing params" });
    const has = await contract.hasVotedInElection(electionId, address);
    res.json({ hasVoted: Boolean(has) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "check failed" });
  }
});

// Submit encrypted vote to chain (for now, call vote with option extracted) and keep encrypted blob server-side
app.post("/submitVote", async (req, res) => {
  try {
    const { electionId, encryptedVote, walletAddress } = req.body || {};
    if (!electionId || !encryptedVote || !walletAddress)
      return res.status(400).json({ error: "invalid body" });

    // Extract option from encryptedVote mock format
    const parts = String(encryptedVote).split("_");
    const optionIndex = Number(parts[3]) || 0;

    // call smart contract vote
    const tx = await contract.vote(electionId, optionIndex);
    const receipt = await tx.wait();

    // store encrypted vote for tally service
    encryptedVotes.push({ electionId, encryptedVote });

    res.json({
      txHash: receipt.hash,
      blockNumber: Number(receipt.blockNumber),
      confirmed: true,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "submit failed" });
  }
});

app.get("/getEncryptedResults", async (_req, res) => {
  res.json({ encryptedResults: encryptedVotes.map((v) => v.encryptedVote) });
});

// ============ Admin endpoints ============
// POST /createElection { title, description, options: string[], durationHours: number, enableFHE?: boolean }
app.post("/createElection", async (req, res) => {
  try {
    const { title, description, options, durationHours, enableFHE } =
      req.body || {};
    if (
      !title ||
      !Array.isArray(options) ||
      options.length < 2 ||
      !durationHours
    ) {
      return res.status(400).json({ error: "invalid body" });
    }
    const tx = await contract.createElection(
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
          return contract.interface.parseLog(log).name === "ElectionCreated";
        } catch {
          return false;
        }
      });
      if (event) {
        electionId =
          contract.interface.parseLog(event).args.electionId?.toString?.() ||
          null;
      }
    } catch {}
    res.json({ txHash: receipt.hash, electionId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "create failed" });
  }
});

// POST /closeElection { electionId }
app.post("/closeElection", async (req, res) => {
  try {
    const { electionId } = req.body || {};
    if (!electionId) return res.status(400).json({ error: "invalid body" });
    const tx = await contract.closeElection(electionId);
    const receipt = await tx.wait();
    res.json({ txHash: receipt.hash });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "close failed" });
  }
});

// GET /activeElections
app.get("/activeElections", async (_req, res) => {
  try {
    const ids = await contract.getActiveElections();
    res.json({ ids: ids.map((x) => Number(x)) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "query failed" });
  }
});

// GET /electionInfo?electionId=1
app.get("/electionInfo", async (req, res) => {
  try {
    const { electionId } = req.query || {};
    if (!electionId)
      return res.status(400).json({ error: "missing electionId" });
    const info = await contract.getElectionInfo(electionId);
    res.json({
      title: info.title,
      description: info.description,
      creator: info.creator,
      startTime: Number(info.startTime),
      endTime: Number(info.endTime),
      status: Number(info.status),
      totalVotes: Number(info.totalVotes),
      optionCount: Number(info.optionCount),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "info failed" });
  }
});

// GET /contractResults?electionId=1
app.get("/contractResults", async (req, res) => {
  try {
    const { electionId } = req.query || {};
    if (!electionId)
      return res.status(400).json({ error: "missing electionId" });
    const results = await contract.getResults(electionId);
    res.json({
      title: results.title,
      description: results.description,
      optionNames: results.optionNames,
      voteCounts: results.voteCounts.map((v) => Number(v)),
      totalVotes: Number(results.totalVotes),
      status: Number(results.status),
      fheEnabled: Boolean(results.fheEnabled),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "results failed" });
  }
});
const port = process.env.PORT || 4002;
app.listen(port, () => console.log(`blockchain-service on :${port}`));
