import { ethers } from "ethers";
import { VOTING_CONTRACT_ABI, CONTRACT_CONFIG } from "../contract-config.js";

export async function createContract() {
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
  let contractAddress = process.env.CONTRACT_ADDRESS || netCfg.address;
  // Fallback to common Hardhat local addresses if no code at the configured address
  const candidates = [
    contractAddress,
    "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9", // common Hardhat default
    "0x5FbDB2315678afecb367f032d93F642f64180aa3", // another common default
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", // common local deploy address
  ].filter(Boolean);
  let picked = contractAddress;
  for (const addr of candidates) {
    try {
      const code = await provider.getCode(addr);
      if (code && code !== "0x") {
        picked = addr;
        break;
      }
    } catch {}
  }
  return new ethers.Contract(picked, VOTING_CONTRACT_ABI, signer);
}
