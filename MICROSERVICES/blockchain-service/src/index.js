import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { ethers } from 'ethers'

// In a real setup, reuse BLOCKCHAIN/contract-config.js directly or via package
import { VOTING_CONTRACT_ABI, CONTRACT_CONFIG } from '../../../BLOCKCHAIN/contract-config.js'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

// Select network config (Node environment: default to development unless env vars provided)
const netCfg = CONTRACT_CONFIG?.development || { rpcUrl: 'http://127.0.0.1:8545', address: '' }
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || netCfg.rpcUrl)
const signer = new ethers.Wallet(process.env.PRIVATE_KEY || ethers.Wallet.createRandom().privateKey, provider)
const contractAddress = process.env.CONTRACT_ADDRESS || netCfg.address
const contract = new ethers.Contract(contractAddress, VOTING_CONTRACT_ABI, signer)

// memory store of encrypted votes (until on-chain FHE storage is wired)
const encryptedVotes = []

app.get('/health', (_req, res) => res.json({ ok: true }))

// Has voted check
app.get('/hasVoted', async (req, res) => {
  try {
    const { electionId, address } = req.query || {}
    if (!electionId || !address) return res.status(400).json({ error: 'missing params' })
    const has = await contract.hasVotedInElection(electionId, address)
    res.json({ hasVoted: Boolean(has) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'check failed' })
  }
})

// Submit encrypted vote to chain (for now, call vote with option extracted) and keep encrypted blob server-side
app.post('/submitVote', async (req, res) => {
  try {
    const { electionId, encryptedVote, walletAddress } = req.body || {}
    if (!electionId || !encryptedVote || !walletAddress) return res.status(400).json({ error: 'invalid body' })

    // Extract option from encryptedVote mock format
    const parts = String(encryptedVote).split('_')
    const optionIndex = Number(parts[3]) || 0

    // call smart contract vote
    const tx = await contract.vote(electionId, optionIndex)
    const receipt = await tx.wait()

    // store encrypted vote for tally service
    encryptedVotes.push({ electionId, encryptedVote })

    res.json({ txHash: receipt.hash, blockNumber: Number(receipt.blockNumber), confirmed: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'submit failed' })
  }
})

app.get('/getEncryptedResults', async (_req, res) => {
  res.json({ encryptedResults: encryptedVotes.map(v => v.encryptedVote) })
})

const port = process.env.PORT || 4002
app.listen(port, () => console.log(`blockchain-service on :${port}`))
