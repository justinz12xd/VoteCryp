import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";

import { createContract } from "./clients/contractClient.js";
import { BlockchainService } from "./services/blockchainService.js";
import { createBlockchainController } from "./controllers/blockchainController.js";
import { buildRoutes } from "./routes/blockchainRoutes.js";

dotenv.config();

export function buildApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Swagger UI
  const openapiPath = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../swagger.yaml");
  app.get("/openapi.yaml", (_req, res) => {
    res.setHeader("Content-Type", "application/yaml");
    fs.createReadStream(openapiPath).pipe(res);
  });
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(undefined, { swaggerUrl: "/openapi.yaml" }));

  // Domain wiring
  const contract = createContract();
  const service = new BlockchainService(contract);
  const controller = createBlockchainController(service);
  app.use(buildRoutes(controller));

  return app;
}
