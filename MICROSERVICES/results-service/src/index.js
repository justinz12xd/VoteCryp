import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Serve OpenAPI and Swagger UI
const openapiPath = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "../openapi.yaml"
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
