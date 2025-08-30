// API de Blockchain para Backend Custodial
// Tu compañero de backend usará esta clase para manejar las wallets

const { ethers } = require('ethers');
const { CONTRACT_CONFIG, VOTING_CONTRACT_ABI } = require('./contract-config.js');

class BackendBlockchainAPI {
  constructor(privateKey, network = 'development') {
    this.network = CONTRACT_CONFIG[network];
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.privateKey = privateKey;
  }

  // Inicializar conexión con una wallet específica
  async initialize() {
    try {
      // Conectar al provider
      if (this.network.networkName === 'localhost') {
        this.provider = new ethers.JsonRpcProvider(this.network.rpcUrl);
      } else {
        this.provider = new ethers.JsonRpcProvider(this.network.rpcUrl);
      }

      // Crear signer con private key
      this.signer = new ethers.Wallet(this.privateKey, this.provider);

      // Conectar al contrato
      this.contract = new ethers.Contract(
        this.network.address,
        VOTING_CONTRACT_ABI,
        this.signer
      );

      console.log('✅ Blockchain API inicializada');
      console.log('🔗 Contrato:', this.network.address);
      console.log('🌐 Red:', this.network.networkName);
      console.log('👤 Wallet:', await this.signer.getAddress());

      return true;
    } catch (error) {
      console.error('❌ Error inicializando blockchain API:', error);
      throw error;
    }
  }

  // ==================== FUNCIONES PARA EL BACKEND ====================

  // Crear wallet custodial para un usuario
  static generateCustodialWallet() {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic.phrase
    };
  }

  // Obtener balance de una wallet
  async getBalance(address = null) {
    try {
      const walletAddress = address || await this.signer.getAddress();
      const balance = await this.provider.getBalance(walletAddress);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error obteniendo balance:', error);
      throw error;
    }
  }

  // Transferir ETH entre wallets (para funding)
  async transferETH(toAddress, amountETH) {
    try {
      const tx = await this.signer.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amountETH.toString())
      });
      
      const receipt = await tx.wait();
      return {
        success: true,
        transactionHash: receipt.hash,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Error transfiriendo ETH:', error);
      throw error;
    }
  }

  // ==================== FUNCIONES DEL CONTRATO ====================

  // Registrar ENS para un usuario (llamado por backend)
  async registerENSForUser(ensName) {
    try {
      const tx = await this.contract.registerENS(ensName);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        gasUsed: receipt.gasUsed.toString(),
        ensName,
        userAddress: await this.signer.getAddress()
      };
    } catch (error) {
      console.error('Error registrando ENS:', error);
      throw error;
    }
  }

  // Crear elección (llamado por backend como admin)
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

      return {
        success: true,
        transactionHash: receipt.hash,
        gasUsed: receipt.gasUsed.toString(),
        electionId,
        title,
        options
      };
    } catch (error) {
      console.error('Error creando elección:', error);
      throw error;
    }
  }

  // Votar en nombre de un usuario (backend firma con wallet custodial)
  async voteForUser(electionId, optionIndex) {
    try {
      const tx = await this.contract.vote(electionId, optionIndex);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        gasUsed: receipt.gasUsed.toString(),
        electionId,
        optionIndex,
        voterAddress: await this.signer.getAddress()
      };
    } catch (error) {
      console.error('Error votando:', error);
      throw error;
    }
  }

  // Cerrar elección (solo admin)
  async closeElection(electionId) {
    try {
      const tx = await this.contract.closeElection(electionId);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.hash,
        gasUsed: receipt.gasUsed.toString(),
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

  // Verificar si una dirección ya votó
  async hasVoted(electionId, userAddress) {
    try {
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

  // Obtener datos ENS de una dirección
  async getENSVoter(address) {
    try {
      const ensData = await this.contract.getENSVoter(address);
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

  // ==================== UTILIDADES PARA EL BACKEND ====================

  // Estimar gas para una transacción
  async estimateGas(method, params) {
    try {
      const gasEstimate = await this.contract[method].estimateGas(...params);
      return gasEstimate.toString();
    } catch (error) {
      console.error('Error estimando gas:', error);
      throw error;
    }
  }

  // Obtener precio del gas actual
  async getGasPrice() {
    try {
      const gasPrice = await this.provider.getFeeData();
      return {
        gasPrice: gasPrice.gasPrice ? ethers.formatUnits(gasPrice.gasPrice, 'gwei') : null,
        maxFeePerGas: gasPrice.maxFeePerGas ? ethers.formatUnits(gasPrice.maxFeePerGas, 'gwei') : null,
        maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas ? ethers.formatUnits(gasPrice.maxPriorityFeePerGas, 'gwei') : null
      };
    } catch (error) {
      console.error('Error obteniendo precio de gas:', error);
      throw error;
    }
  }

  // Verificar si el contrato está desplegado
  async verifyContract() {
    try {
      const code = await this.provider.getCode(this.network.address);
      return code !== '0x';
    } catch (error) {
      console.error('Error verificando contrato:', error);
      return false;
    }
  }
}

module.exports = BackendBlockchainAPI;
