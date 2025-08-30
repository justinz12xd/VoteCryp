import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// --- Swagger/OpenAPI docs ---
const openapi = {
  openapi: "3.0.3",
  info: {
    title: "Encryption Service API",
    version: "1.0.0",
    description:
      "Mock Zama FHE encryption and tally service used by VoteCryp backend.",
  },
  servers: [{ url: "/" }],
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { ok: { type: "boolean" } },
                },
              },
            },
          },
        },
      },
    },
    "/encryptVote": {
      post: {
        summary: "Encrypt a vote",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["candidateIndex", "electionId"],
                properties: {
                  candidateIndex: { type: "integer" },
                  electionId: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Encrypted vote blob",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { encryptedVote: { type: "string" } },
                },
              },
            },
          },
          400: { description: "Invalid body" },
        },
      },
    },
    "/tallyVotes": {
      post: {
        summary: "Homomorphically tally encrypted votes (mock)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["encryptedVotes"],
                properties: {
                  encryptedVotes: { type: "array", items: { type: "string" } },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Encrypted tally",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { tallyEncrypted: { type: "string" } },
                },
              },
            },
          },
          400: { description: "Invalid body" },
        },
      },
    },
  },
};

app.get("/openapi.json", (_req, res) => res.json(openapi));
app.get("/docs", (_req, res) => {
  res.type("html").send(`<!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>Encryption Service Docs</title>
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
