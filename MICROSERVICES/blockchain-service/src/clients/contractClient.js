import { ethers } from "ethers";
import { VOTING_CONTRACT_ABI, CONTRACT_CONFIG } from "../contract-config.js";

export function createContract() {
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
  return new ethers.Contract(contractAddress, VOTING_CONTRACT_ABI, signer);
}
