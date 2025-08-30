import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ethers } from "ethers";

// In a real setup, reuse BLOCKCHAIN/contract-config.js directly or via package
import { VOTING_CONTRACT_ABI, CONTRACT_CONFIG } from "./contract-config.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// --- Swagger/OpenAPI docs ---
const openapi = {
  openapi: "3.0.3",
  info: { title: "Blockchain Service API", version: "1.0.0" },
  servers: [{ url: "/" }],
  paths: {
    "/health": { get: { summary: "Health", responses: { 200: { description: "OK" } } } },
    "/hasVoted": {
      get: {
        summary: "Check if address has voted in an election",
        parameters: [
          { name: "electionId", in: "query", required: true, schema: { type: "string" } },
          { name: "address", in: "query", required: true, schema: { type: "string" } },
        ],
        responses: { 200: { description: "OK", content: { "application/json": { schema: { type: "object", properties: { hasVoted: { type: "boolean" } } } } } } },
      },
    },
    "/submitVote": {
      post: {
        summary: "Submit encrypted vote and relay to contract",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", required: ["electionId", "encryptedVote", "walletAddress"], properties: { electionId: { type: "string" }, encryptedVote: { type: "string" }, walletAddress: { type: "string" } } } } },
        },
        responses: { 200: { description: "Tx receipt info" }, 400: { description: "Invalid body" } },
      },
    },
    "/getEncryptedResults": { get: { summary: "Get stored encrypted vote blobs", responses: { 200: { description: "OK" } } } },
    "/registerENS": { post: { summary: "Register ENS for signer (dev)", requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["ensName"], properties: { ensName: { type: "string" } } } } } }, responses: { 200: { description: "OK" } } } },
    "/createElection": { post: { summary: "Create election", responses: { 200: { description: "OK" } } } },
    "/closeElection": { post: { summary: "Close election", responses: { 200: { description: "OK" } } } },
    "/activeElections": { get: { summary: "List active election IDs", responses: { 200: { description: "OK" } } } },
    "/electionInfo": { get: { summary: "Get election info", parameters: [{ name: "electionId", in: "query", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },
    "/contractResults": { get: { summary: "Get on-chain results", parameters: [{ name: "electionId", in: "query", required: true, schema: { type: "string" } }], responses: { 200: { description: "OK" } } } },
  },
};

app.get("/openapi.json", (_req, res) => res.json(openapi));
app.get("/docs", (_req, res) => {
  res.type("html").send(`<!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>Blockchain Service Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({ url: '/openapi.json', dom_id: '#swagger-ui' });
    </script>
  </body>
  </html>`);
});

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
// POST /registerENS { ensName }
app.post("/registerENS", async (req, res) => {
  try {
    const { ensName } = req.body || {};
    if (!ensName || typeof ensName !== "string") {
      return res.status(400).json({ error: "invalid body" });
    }
    const tx = await contract.registerENS(ensName);
    const receipt = await tx.wait();
    res.json({ txHash: receipt.hash, ensName });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "register failed" });
  }
});
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
