// Archivo de ejemplo para el frontend - Integración del Smart Contract
import { ethers } from 'ethers';
import { CONTRACT_CONFIG, VOTING_CONTRACT_ABI, getCurrentNetwork } from './contract-config.js';

class VotingContractAPI {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.network = null;
  }

  // Inicializar conexión con wallet
  async connect() {
    if (!window.ethereum) {
      throw new Error('MetaMask no está instalado');
    }

    try {
      // Solicitar acceso a la wallet
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.network = getCurrentNetwork();
      
      // Crear instancia del contrato
      this.contract = new ethers.Contract(
        this.network.address,
        VOTING_CONTRACT_ABI,
        this.signer
      );

      // Verificar red
      const chainId = await this.provider.getNetwork();
      if (Number(chainId.chainId) !== this.network.chainId) {
        await this.switchNetwork();
      }

      return true;
    } catch (error) {
      console.error('Error conectando wallet:', error);
      throw error;
    }
  }

  // Cambiar red si es necesario
  async switchNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${this.network.chainId.toString(16)}` }],
      });
    } catch (switchError) {
      // Red no agregada, intentar agregarla
      if (switchError.code === 4902) {
        await this.addNetwork();
      } else {
        throw switchError;
      }
    }
  }

  // Agregar red personalizada
  async addNetwork() {
    if (this.network.chainId === 31337) return; // No agregar red local

    const networkParams = {
      chainId: `0x${this.network.chainId.toString(16)}`,
      chainName: this.network.networkName,
      rpcUrls: [this.network.rpcUrl],
      blockExplorerUrls: [this.network.explorerUrl],
    };

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkParams],
    });
  }

  // ==================== FUNCIONES DEL CONTRATO ====================

  // 1. Registrar ENS
  async registerENS(ensName) {
    try {
      const tx = await this.contract.registerENS(ensName);
      const receipt = await tx.wait();
      
      console.log(`ENS registrado: ${ensName}`);
      return {
        success: true,
        transactionHash: receipt.hash,
        ensName
      };
    } catch (error) {
      console.error('Error registrando ENS:', error);
      throw error;
    }
  }

  // 2. Crear elección
  async createElection(title, description, options, durationHours) {
    try {
      const tx = await this.contract.createElection(
        title,
        description,
        options,
        durationHours,
        false // FHE deshabilitado por ahora
      );
      
      const receipt = await tx.wait();
      
      // Buscar el evento ElectionCreated para obtener el ID
      const event = receipt.logs.find(log => {
        try {
          const parsed = this.contract.interface.parseLog(log);
          return parsed.name === 'ElectionCreated';
        } catch {
          return false;
        }
      });

      const electionId = event ? 
        this.contract.interface.parseLog(event).args.electionId.toString() : 
        null;

      console.log(`Elección creada con ID: ${electionId}`);
      return {
        success: true,
        transactionHash: receipt.hash,
        electionId
      };
    } catch (error) {
      console.error('Error creando elección:', error);
      throw error;
    }
  }

  // 3. Votar
  async vote(electionId, optionIndex) {
    try {
      const tx = await this.contract.vote(electionId, optionIndex);
      const receipt = await tx.wait();
      
      console.log(`Voto registrado en elección ${electionId}, opción ${optionIndex}`);
      return {
        success: true,
        transactionHash: receipt.hash,
        electionId,
        optionIndex
      };
    } catch (error) {
      console.error('Error votando:', error);
      throw error;
    }
  }

  // 4. Cerrar elección
  async closeElection(electionId) {
    try {
      const tx = await this.contract.closeElection(electionId);
      const receipt = await tx.wait();
      
      console.log(`Elección ${electionId} cerrada`);
      return {
        success: true,
        transactionHash: receipt.hash,
        electionId
      };
    } catch (error) {
      console.error('Error cerrando elección:', error);
      throw error;
    }
  }

  // ==================== FUNCIONES DE CONSULTA ====================

  // Obtener información de elección
  async getElectionInfo(electionId) {
    try {
      const info = await this.contract.getElectionInfo(electionId);
      return {
        title: info.title,
        description: info.description,
        creator: info.creator,
        startTime: new Date(Number(info.startTime) * 1000),
        endTime: new Date(Number(info.endTime) * 1000),
        status: Number(info.status), // 0=Active, 1=Closed
        totalVotes: Number(info.totalVotes),
        optionCount: Number(info.optionCount)
      };
    } catch (error) {
      console.error('Error obteniendo info de elección:', error);
      throw error;
    }
  }

  // Obtener resultados
  async getResults(electionId) {
    try {
      const results = await this.contract.getResults(electionId);
      return {
        title: results.title,
        description: results.description,
        options: results.optionNames,
        votes: results.voteCounts.map(v => Number(v)),
        totalVotes: Number(results.totalVotes),
        status: Number(results.status),
        fheEnabled: results.fheEnabled
      };
    } catch (error) {
      console.error('Error obteniendo resultados:', error);
      throw error;
    }
  }

  // Verificar si usuario ya votó
  async hasVoted(electionId, address = null) {
    try {
      const userAddress = address || await this.signer.getAddress();
      const hasVoted = await this.contract.hasVotedInElection(electionId, userAddress);
      return hasVoted;
    } catch (error) {
      console.error('Error verificando voto:', error);
      throw error;
    }
  }

  // Obtener elecciones activas
  async getActiveElections() {
    try {
      const activeIds = await this.contract.getActiveElections();
      return activeIds.map(id => Number(id));
    } catch (error) {
      console.error('Error obteniendo elecciones activas:', error);
      throw error;
    }
  }

  // Obtener total de elecciones
  async getTotalElections() {
    try {
      const total = await this.contract.getTotalElections();
      return Number(total);
    } catch (error) {
      console.error('Error obteniendo total de elecciones:', error);
      throw error;
    }
  }

  // Obtener datos ENS del usuario
  async getENSVoter(address = null) {
    try {
      const userAddress = address || await this.signer.getAddress();
      const ensData = await this.contract.getENSVoter(userAddress);
      return {
        ensName: ensData.ensName,
        isVerified: ensData.isVerified,
        registrationTime: new Date(Number(ensData.registrationTime) * 1000)
      };
    } catch (error) {
      console.error('Error obteniendo datos ENS:', error);
      throw error;
    }
  }

  // ==================== EVENTOS ====================

  // Escuchar eventos
  setupEventListeners() {
    if (!this.contract) return;

    // Nueva elección creada
    this.contract.on('ElectionCreated', (electionId, title, creator, startTime, endTime) => {
      console.log('🗳️ Nueva elección creada:', {
        id: Number(electionId),
        title,
        creator,
        startTime: new Date(Number(startTime) * 1000),
        endTime: new Date(Number(endTime) * 1000)
      });
      
      // Emit custom event para el frontend
      window.dispatchEvent(new CustomEvent('electionCreated', {
        detail: { electionId: Number(electionId), title, creator }
      }));
    });

    // Nuevo voto
    this.contract.on('VoteCast', (electionId, voter, ensName, optionIndex, timestamp) => {
      console.log('✅ Nuevo voto:', {
        electionId: Number(electionId),
        voter,
        ensName,
        optionIndex: Number(optionIndex),
        timestamp: new Date(Number(timestamp) * 1000)
      });
      
      window.dispatchEvent(new CustomEvent('voteCast', {
        detail: { electionId: Number(electionId), voter, ensName, optionIndex: Number(optionIndex) }
      }));
    });

    // Elección cerrada
    this.contract.on('ElectionClosed', (electionId, totalVotes, timestamp) => {
      console.log('🔒 Elección cerrada:', {
        electionId: Number(electionId),
        totalVotes: Number(totalVotes),
        timestamp: new Date(Number(timestamp) * 1000)
      });
      
      window.dispatchEvent(new CustomEvent('electionClosed', {
        detail: { electionId: Number(electionId), totalVotes: Number(totalVotes) }
      }));
    });

    // ENS registrado
    this.contract.on('ENSRegistered', (voter, ensName, timestamp) => {
      console.log('📝 ENS registrado:', {
        voter,
        ensName,
        timestamp: new Date(Number(timestamp) * 1000)
      });
      
      window.dispatchEvent(new CustomEvent('ensRegistered', {
        detail: { voter, ensName }
      }));
    });
  }

  // Limpiar listeners
  removeEventListeners() {
    if (this.contract) {
      this.contract.removeAllListeners();
    }
  }
}

// Exportar API
export default VotingContractAPI;

// Para Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VotingContractAPI;
}
