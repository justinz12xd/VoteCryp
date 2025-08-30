import { Router } from "express";

export function buildRoutes(ctrl) {
  const r = Router();
  r.get("/health", ctrl.health);
  r.post("/decryptResults", ctrl.decryptResults);
  return r;
}
