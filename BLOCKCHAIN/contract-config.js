// Configuración del contrato para el frontend
const CONTRACT_CONFIG = {
  // Red de desarrollo local (Hardhat)
  development: {
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    chainId: 31337,
    networkName: "localhost",
    rpcUrl: "http://127.0.0.1:8545"
  },
  
  // Testnet Lisk Sepolia (recomendado)
  liskSepolia: {
    address: "", // Se actualizará después del deploy
    chainId: 4202,
    networkName: "Lisk Sepolia Testnet",
    rpcUrl: "https://rpc.sepolia-api.lisk.com",
    explorerUrl: "https://sepolia-blockscout.lisk.com"
  },
  
  // Testnet Ethereum Sepolia (alternativa)
  ethereumSepolia: {
    address: "", // Se actualizará después del deploy
    chainId: 11155111,
    networkName: "Sepolia Testnet",
    rpcUrl: "https://sepolia.infura.io/v3/[INFURA_KEY]",
    explorerUrl: "https://sepolia.etherscan.io"
  }
};

// ABI simplificado para el frontend
const VOTING_CONTRACT_ABI = [
  // Eventos
  "event ElectionCreated(uint256 indexed electionId, string title, address indexed creator, uint256 startTime, uint256 endTime)",
  "event VoteCast(uint256 indexed electionId, address indexed voter, string ensName, uint256 optionIndex, uint256 timestamp)",
  "event ElectionClosed(uint256 indexed electionId, uint256 totalVotes, uint256 timestamp)",
  "event ENSRegistered(address indexed voter, string ensName, uint256 timestamp)",
  
  // Funciones de lectura (view/pure)
  "function getElectionInfo(uint256 electionId) view returns (string title, string description, address creator, uint256 startTime, uint256 endTime, uint8 status, uint256 totalVotes, uint256 optionCount)",
  "function getResults(uint256 electionId) view returns (string title, string description, string[] optionNames, uint256[] voteCounts, uint256 totalVotes, uint8 status, bool fheEnabled)",
  "function hasVotedInElection(uint256 electionId, address voter) view returns (bool)",
  "function getActiveElections() view returns (uint256[])",
  "function getTotalElections() view returns (uint256)",
  "function getENSVoter(address voter) view returns (string ensName, bool isVerified, uint256 registrationTime)",
  "function elections(uint256) view returns (string title, string description, address creator, uint256 startTime, uint256 endTime, uint8 status, uint256 totalVotes, bool fheEnabled)",
  "function owner() view returns (address)",
  
  // Funciones de escritura
  "function registerENS(string _ensName) external",
  "function createElection(string _title, string _description, string[] _optionNames, uint256 _durationInHours, bool _enableFHE) external returns (uint256)",
  "function vote(uint256 electionId, uint256 option) external",
  "function closeElection(uint256 electionId) external"
];

// Función helper para obtener la configuración actual
function getCurrentNetwork() {
  const chainId = window.ethereum?.chainId;
  
  switch (parseInt(chainId, 16)) {
    case 31337:
      return CONTRACT_CONFIG.development;
    case 4202:
      return CONTRACT_CONFIG.liskSepolia;
    case 11155111:
      return CONTRACT_CONFIG.ethereumSepolia;
    default:
      return CONTRACT_CONFIG.development; // Fallback
  }
}

// Exportar para uso en el frontend
export {
  CONTRACT_CONFIG,
  VOTING_CONTRACT_ABI,
  getCurrentNetwork
};

// Para uso en Node.js (backend)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CONTRACT_CONFIG,
    VOTING_CONTRACT_ABI,
    getCurrentNetwork
  };
}
