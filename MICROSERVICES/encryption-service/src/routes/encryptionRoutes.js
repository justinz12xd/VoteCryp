import { Router } from "express";

export function buildRoutes(ctrl) {
  const r = Router();
  r.get("/health", ctrl.health);
  r.post("/encryptVote", ctrl.encryptVote);
  r.post("/tallyVotes", ctrl.tallyVotes);
  return r;
}
