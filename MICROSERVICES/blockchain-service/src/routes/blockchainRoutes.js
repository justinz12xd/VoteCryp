import { Router } from "express";

export function buildRoutes(ctrl) {
  const r = Router();
  r.get("/health", ctrl.health);
  r.get("/hasVoted", ctrl.hasVoted);
  r.post("/submitVote", ctrl.submitVote);
  r.get("/getEncryptedResults", ctrl.getEncryptedResults);
  r.post("/createElection", ctrl.createElection);
  // Helper endpoint for quick testing without JSON body
  r.get("/createElectionQuick", ctrl.createElectionQuick);
  r.post("/closeElection", ctrl.closeElection);
  r.get("/activeElections", ctrl.activeElections);
  r.get("/electionInfo", ctrl.electionInfo);
  r.get("/contractResults", ctrl.contractResults);
  // ENS endpoints
  r.get("/getENSVoter", ctrl.getENSVoter);
  r.post("/registerENSWithPK", ctrl.registerENSWithPK);
  return r;
}
