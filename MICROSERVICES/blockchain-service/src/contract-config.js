// Local copy for container build context; keep in sync with /BLOCKCHAIN/contract-config.js if needed.
export const CONTRACT_CONFIG = {
  development: {
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    chainId: 31337,
    networkName: "localhost",
    rpcUrl: "http://127.0.0.1:8545",
  },
};

export const VOTING_CONTRACT_ABI = [
  "event ElectionCreated(uint256 indexed electionId, string title, address indexed creator, uint256 startTime, uint256 endTime)",
  "event VoteCast(uint256 indexed electionId, address indexed voter, string ensName, uint256 optionIndex, uint256 timestamp)",
  "event ElectionClosed(uint256 indexed electionId, uint256 totalVotes, uint256 timestamp)",
  "event ENSRegistered(address indexed voter, string ensName, uint256 timestamp)",
  "function getElectionInfo(uint256 electionId) view returns (string title, string description, address creator, uint256 startTime, uint256 endTime, uint256 status, uint256 totalVotes, uint256 optionCount)",
  "function getResults(uint256 electionId) view returns (string title, string description, string[] optionNames, uint256[] voteCounts, uint256 totalVotes, uint256 status, bool fheEnabled)",
  "function hasVotedInElection(uint256 electionId, address voter) view returns (bool)",
  "function getActiveElections() view returns (uint256[])",
  "function getTotalElections() view returns (uint256)",
  "function getENSVoter(address voter) view returns (string ensName, bool isVerified, uint256 registrationTime)",
  "function elections(uint256) view returns (string title, string description, address creator, uint256 startTime, uint256 endTime, uint256 status, uint256 totalVotes, bool fheEnabled)",
  "function owner() view returns (address)",
  "function registerENS(string _ensName) external",
  "function createElection(string _title, string _description, string[] _optionNames, uint256 _durationInHours, bool _enableFHE) external returns (uint256)",
  "function vote(uint256 electionId, uint256 option) external",
  "function closeElection(uint256 electionId) external",
];
