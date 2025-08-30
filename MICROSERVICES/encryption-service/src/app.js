import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";

import { EncryptionService } from "./services/encryptionService.js";
import { createEncryptionController } from "../src/controllers/encryptionController.js";
import { buildRoutes } from "../src/routes/encryptionRoutes.js";

dotenv.config();

export function buildApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const openapiPath = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../openapi.yaml");
  app.get("/openapi.yaml", (_req, res) => {
    res.setHeader("Content-Type", "application/yaml");
    fs.createReadStream(openapiPath).pipe(res);
  });
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(undefined, { swaggerUrl: "/openapi.yaml" }));

  const service = new EncryptionService();
  const controller = createEncryptionController(service);
  app.use(buildRoutes(controller));

  return app;
}
