// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title VotingContract
 * @dev Contrato de votación con integración ENS y preparado para Zama FHE
 * Diseñado para Lisk testnet con funciones mínimas requeridas
 */
contract VotingContract is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    // Contador para IDs de elecciones
    Counters.Counter private _electionIds;
    
    // Estados de elección
    enum ElectionStatus { Active, Closed, Finalized }
    
    // Estructura para opciones de votación
    struct VoteOption {
        string name;
        uint256 voteCount;
        bytes encryptedResults; // Para integración futura con Zama FHE
    }
    
    // Estructura simplificada de elección
    struct ElectionInfo {
        uint256 id;
        string title;
        string description;
        address creator;
        uint256 startTime;
        uint256 endTime;
        ElectionStatus status;
        uint256 totalVotes;
        bool fheEnabled;
    }
    
    // Estructura para registro ENS
    struct ENSVoter {
        address voterAddress;
        string ensName;
        bool isVerified;
        uint256 registrationTime;
    }
    
    // Mappings principales
    mapping(uint256 => ElectionInfo) public elections;
    mapping(uint256 => VoteOption[]) public electionOptions;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(string => bool)) public ensVoted;
    mapping(address => ENSVoter) public ensVoters;
    mapping(string => address) public ensToAddress;
    
    // Arrays para tracking
    uint256[] public activeElectionIds;
    
    // Events requeridos
    event ElectionCreated(
        uint256 indexed electionId,
        string title,
        address indexed creator,
        uint256 startTime,
        uint256 endTime
    );
    
    event VoteCast(
        uint256 indexed electionId,
        address indexed voter,
        string ensName,
        uint256 optionIndex,
        uint256 timestamp
    );
    
    event ElectionClosed(
        uint256 indexed electionId,
        uint256 totalVotes,
        uint256 timestamp
    );
    
    event ENSRegistered(
        address indexed voter,
        string ensName,
        uint256 timestamp
    );
    
    // Modifiers
    modifier validElection(uint256 _electionId) {
        require(_electionId > 0 && _electionId <= _electionIds.current(), "Election does not exist");
        _;
    }
    
    modifier electionActive(uint256 _electionId) {
        require(elections[_electionId].status == ElectionStatus.Active, "Election is not active");
        require(block.timestamp >= elections[_electionId].startTime, "Election has not started");
        require(block.timestamp <= elections[_electionId].endTime, "Election has ended");
        _;
    }
    
    modifier onlyENSVerified() {
        require(ensVoters[msg.sender].isVerified, "Must be verified with ENS");
        _;
    }
    
    constructor() {
        // Constructor vacío - el deployer es owner por defecto
    }
    
    /**
     * @dev Registrar ENS para votante (simulado para desarrollo)
     * En producción se integraría con ENS registry real
     */
    function registerENS(string memory _ensName) external {
        require(bytes(_ensName).length > 0, "ENS name cannot be empty");
        require(!ensVoters[msg.sender].isVerified, "Already registered");
        require(ensToAddress[_ensName] == address(0), "ENS name already taken");
        
        ensVoters[msg.sender] = ENSVoter({
            voterAddress: msg.sender,
            ensName: _ensName,
            isVerified: true,
            registrationTime: block.timestamp
        });
        
        ensToAddress[_ensName] = msg.sender;
        
        emit ENSRegistered(msg.sender, _ensName, block.timestamp);
    }
    
    /**
     * @dev Función principal: createElection
     * Crear nueva elección con las opciones especificadas
     */
    function createElection(
        string memory _title,
        string memory _description,
        string[] memory _optionNames,
        uint256 _durationInHours,
        bool _enableFHE
    ) external returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_optionNames.length >= 2, "Must have at least 2 options");
        require(_durationInHours > 0, "Duration must be positive");
        
        _electionIds.increment();
        uint256 newElectionId = _electionIds.current();
        
        elections[newElectionId] = ElectionInfo({
            id: newElectionId,
            title: _title,
            description: _description,
            creator: msg.sender,
            startTime: block.timestamp,
            endTime: block.timestamp + (_durationInHours * 1 hours),
            status: ElectionStatus.Active,
            totalVotes: 0,
            fheEnabled: _enableFHE
        });
        
        // Agregar opciones de votación
        for (uint256 i = 0; i < _optionNames.length; i++) {
            electionOptions[newElectionId].push(VoteOption({
                name: _optionNames[i],
                voteCount: 0,
                encryptedResults: ""
            }));
        }
        
        activeElectionIds.push(newElectionId);
        
        emit ElectionCreated(
            newElectionId,
            _title,
            msg.sender,
            elections[newElectionId].startTime,
            elections[newElectionId].endTime
        );
        
        return newElectionId;
    }
    
    /**
     * @dev Función principal: vote
     * Emitir voto en elección específica con control de unicidad ENS + dirección
     */
    function vote(uint256 electionId, uint256 option) external 
        validElection(electionId)
        electionActive(electionId)
        onlyENSVerified
        nonReentrant
    {
        string memory voterENS = ensVoters[msg.sender].ensName;
        
        // Control de unicidad: ENS + dirección
        require(!hasVoted[electionId][msg.sender], "Address already voted");
        require(!ensVoted[electionId][voterENS], "ENS already voted");
        require(option < electionOptions[electionId].length, "Invalid option");
        
        // Registrar voto
        hasVoted[electionId][msg.sender] = true;
        ensVoted[electionId][voterENS] = true;
        elections[electionId].totalVotes++;
        
        // Si FHE está habilitado, aquí se integraría con Zama
        if (elections[electionId].fheEnabled) {
            // TODO: Integrar con Zama FHE para cifrado
            // Por ahora incrementamos normalmente
            electionOptions[electionId][option].voteCount++;
        } else {
            // Votación normal sin cifrado
            electionOptions[electionId][option].voteCount++;
        }
        
        emit VoteCast(electionId, msg.sender, voterENS, option, block.timestamp);
    }
    
    /**
     * @dev Función principal: closeElection
     * Cerrar elección antes del tiempo límite (solo creador o owner)
     */
    function closeElection(uint256 electionId) external validElection(electionId) {
        require(
            msg.sender == elections[electionId].creator || msg.sender == owner(),
            "Only creator or owner can close election"
        );
        require(elections[electionId].status == ElectionStatus.Active, "Election already closed");
        
        elections[electionId].status = ElectionStatus.Closed;
        
        // Remover de elecciones activas
        _removeFromActiveElections(electionId);
        
        emit ElectionClosed(electionId, elections[electionId].totalVotes, block.timestamp);
    }
    
    /**
     * @dev Función principal: getResults
     * Obtener resultados de elección (disponible siempre)
     */
    function getResults(uint256 electionId) external view validElection(electionId) 
        returns (
            string memory title,
            string memory description,
            string[] memory optionNames,
            uint256[] memory voteCounts,
            uint256 totalVotes,
            ElectionStatus status,
            bool fheEnabled
        ) 
    {
        ElectionInfo memory election = elections[electionId];
        VoteOption[] memory options = electionOptions[electionId];
        
        uint256 optionCount = options.length;
        optionNames = new string[](optionCount);
        voteCounts = new uint256[](optionCount);
        
        for (uint256 i = 0; i < optionCount; i++) {
            optionNames[i] = options[i].name;
            voteCounts[i] = options[i].voteCount;
        }
        
        return (
            election.title,
            election.description,
            optionNames,
            voteCounts,
            election.totalVotes,
            election.status,
            election.fheEnabled
        );
    }
    
    /**
     * @dev Obtener información básica de elección
     */
    function getElectionInfo(uint256 electionId) external view validElection(electionId)
        returns (
            string memory title,
            string memory description,
            address creator,
            uint256 startTime,
            uint256 endTime,
            ElectionStatus status,
            uint256 totalVotes,
            uint256 optionCount
        )
    {
        ElectionInfo memory election = elections[electionId];
        return (
            election.title,
            election.description,
            election.creator,
            election.startTime,
            election.endTime,
            election.status,
            election.totalVotes,
            electionOptions[electionId].length
        );
    }
    
    /**
     * @dev Verificar si una dirección ya votó
     */
    function hasVotedInElection(uint256 electionId, address voter) external view returns (bool) {
        return hasVoted[electionId][voter];
    }
    
    /**
     * @dev Verificar si un ENS ya votó
     */
    function hasENSVoted(uint256 electionId, string memory ensName) external view returns (bool) {
        return ensVoted[electionId][ensName];
    }
    
    /**
     * @dev Obtener elecciones activas
     */
    function getActiveElections() external view returns (uint256[] memory) {
        return activeElectionIds;
    }
    
    /**
     * @dev Obtener total de elecciones creadas
     */
    function getTotalElections() external view returns (uint256) {
        return _electionIds.current();
    }
    
    /**
     * @dev Obtener información del votante ENS
     */
    function getENSVoter(address voter) external view returns (
        string memory ensName,
        bool isVerified,
        uint256 registrationTime
    ) {
        ENSVoter memory ensVoter = ensVoters[voter];
        return (ensVoter.ensName, ensVoter.isVerified, ensVoter.registrationTime);
    }
    
    /**
     * @dev Función para integración futura con Zama FHE
     * Actualizar resultados cifrados (solo para elecciones con FHE habilitado)
     */
    function updateEncryptedResults(
        uint256 electionId,
        uint256 optionIndex,
        bytes memory encryptedData
    ) external onlyOwner validElection(electionId) {
        require(elections[electionId].fheEnabled, "FHE not enabled for this election");
        require(optionIndex < electionOptions[electionId].length, "Invalid option index");
        
        electionOptions[electionId][optionIndex].encryptedResults = encryptedData;
    }
    
    /**
     * @dev Cerrar automáticamente elecciones expiradas
     */
    function closeExpiredElections() external {
        for (uint256 i = 0; i < activeElectionIds.length; i++) {
            uint256 electionId = activeElectionIds[i];
            ElectionInfo storage election = elections[electionId];
            
            if (block.timestamp > election.endTime && election.status == ElectionStatus.Active) {
                election.status = ElectionStatus.Closed;
                emit ElectionClosed(electionId, election.totalVotes, block.timestamp);
            }
        }
        
        // Limpiar array de elecciones activas
        _cleanActiveElections();
    }
    
    // Funciones internas
    function _removeFromActiveElections(uint256 electionId) internal {
        for (uint256 i = 0; i < activeElectionIds.length; i++) {
            if (activeElectionIds[i] == electionId) {
                activeElectionIds[i] = activeElectionIds[activeElectionIds.length - 1];
                activeElectionIds.pop();
                break;
            }
        }
    }
    
    function _cleanActiveElections() internal {
        uint256[] memory newActiveElections = new uint256[](activeElectionIds.length);
        uint256 newIndex = 0;
        
        for (uint256 i = 0; i < activeElectionIds.length; i++) {
            uint256 electionId = activeElectionIds[i];
            if (elections[electionId].status == ElectionStatus.Active) {
                newActiveElections[newIndex] = electionId;
                newIndex++;
            }
        }
        
        // Resetear array
        delete activeElectionIds;
        for (uint256 i = 0; i < newIndex; i++) {
            activeElectionIds.push(newActiveElections[i]);
        }
    }
}
