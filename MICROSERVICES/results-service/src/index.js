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
  info: { title: "Results Service API", version: "1.0.0" },
  servers: [{ url: "/" }],
  paths: {
    "/health": { get: { summary: "Health", responses: { 200: { description: "OK" } } } },
    "/decryptResults": {
      post: {
        summary: "Decrypt tallied results (mock)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["encryptedResults"],
                properties: { encryptedResults: { type: "array", items: { type: "string" } } },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Decrypted results array",
            content: { "application/json": { schema: { type: "object", properties: { decryptedResults: { type: "array", items: { type: "integer" } }, success: { type: "boolean" } } } } },
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
    <title>Results Service Docs</title>
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

app.get("/health", (_req, res) => res.json({ ok: true }));

// POST /decryptResults { encryptedResults: string[] }
app.post("/decryptResults", async (req, res) => {
  const { encryptedResults } = req.body || {};
  if (!Array.isArray(encryptedResults))
    return res.status(400).json({ error: "invalid body" });
  await new Promise((r) => setTimeout(r, 500));
  // Mock: return fixed sample as in the frontend api route
  res.json({ decryptedResults: [523, 412, 312], success: true });
});

const port = process.env.PORT || 4003;
app.listen(port, () => console.log(`results-service on :${port}`));
