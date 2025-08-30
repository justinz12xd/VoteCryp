// Información de deployment para el frontend
// Este archivo se genera automáticamente después del deploy

export const CONTRACT_INFO = {
  // Actualizar estas direcciones después de cada deploy
  addresses: {
    local: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    liskSepolia: "", // Completar después del deploy en testnet
    sepolia: "", // Completar después del deploy en Ethereum Sepolia
  },
  
  // Chain IDs
  chainIds: {
    local: 31337,
    liskSepolia: 4202,
    sepolia: 11155111,
  },
  
  // ABIs principales para el frontend
  abi: [
    // Funciones principales
    "function registerENS(string memory _ensName) external",
    "function createElection(string memory _title, string memory _description, string[] memory _optionNames, uint256 _durationInHours, bool _enableFHE) external returns (uint256)",
    "function vote(uint256 electionId, uint256 option) external",
    "function closeElection(uint256 electionId) external",
    "function getResults(uint256 electionId) external view returns (string memory title, string memory description, string[] memory optionNames, uint256[] memory voteCounts, uint256 totalVotes, uint8 status, bool fheEnabled)",
    
    // Funciones de consulta
    "function getElectionInfo(uint256 electionId) external view returns (string memory title, string memory description, address creator, uint256 startTime, uint256 endTime, uint8 status, uint256 totalVotes, uint256 optionCount)",
    "function hasVoted(uint256 electionId, address voter) external view returns (bool)",
    "function hasENSVoted(uint256 electionId, string memory ensName) external view returns (bool)",
    "function getActiveElections() external view returns (uint256[] memory)",
    "function getTotalElections() external view returns (uint256)",
    "function getENSVoter(address voter) external view returns (string memory ensName, bool isVerified, uint256 registrationTime)",
    
    // Eventos
    "event ElectionCreated(uint256 indexed electionId, string title, address indexed creator, uint256 startTime, uint256 endTime)",
    "event VoteCast(uint256 indexed electionId, address indexed voter, string ensName, uint256 optionIndex, uint256 timestamp)",
    "event ElectionClosed(uint256 indexed electionId, uint256 totalVotes, uint256 timestamp)",
    "event ENSRegistered(address indexed voter, string ensName, uint256 timestamp)"
  ]
};

// Ejemplo de uso en el frontend:
/*
import { ethers } from 'ethers';
import { CONTRACT_INFO } from './contract-info.js';

// Conectar al contrato
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(
  CONTRACT_INFO.addresses.local, // o liskSepolia, sepolia
  CONTRACT_INFO.abi,
  signer
);

// Usar las funciones
await contract.registerENS("mi-nombre.eth");
await contract.createElection("Mi Elección", "Descripción", ["Si", "No"], 24, false);
await contract.vote(1, 0);
const results = await contract.getResults(1);
*/
