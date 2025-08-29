"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Shield, Vote, Wallet, BarChart3, Lock, Zap, Network, Key } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock data for demonstration
const mockElections = [
  {
    id: 1,
    title: "Elección de Presidente DAO",
    description: "Votación para elegir el nuevo presidente de la organización",
    status: "active",
    startDate: "2024-01-15",
    endDate: "2024-01-30",
    totalVotes: 1247,
    liskTxHash: "0x1a2b3c4d5e6f7890abcdef1234567890",
    zkProofVerified: true,
    candidates: [
      { name: "Alice Johnson", votes: 523, percentage: 42, encryptedVotes: "zama_encrypted_523" },
      { name: "Bob Smith", votes: 412, percentage: 33, encryptedVotes: "zama_encrypted_412" },
      { name: "Carol Davis", votes: 312, percentage: 25, encryptedVotes: "zama_encrypted_312" },
    ],
  },
  {
    id: 2,
    title: "Propuesta de Mejoras",
    description: "Votación sobre implementación de nuevas características",
    status: "completed",
    startDate: "2024-01-01",
    endDate: "2024-01-14",
    totalVotes: 892,
    liskTxHash: "0x9876543210fedcba0987654321",
    zkProofVerified: true,
    candidates: [
      { name: "A favor", votes: 634, percentage: 71, encryptedVotes: "zama_encrypted_634" },
      { name: "En contra", votes: 258, percentage: 29, encryptedVotes: "zama_encrypted_258" },
    ],
  },
]

// Mock admin addresses (in real app, this would be from smart contract)
const ADMIN_ADDRESSES = ["0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e1e1", "admin.eth", "dao-admin.eth"]

export default function BlockchainVotingSystem() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [ensName, setEnsName] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedElection, setSelectedElection] = useState<number | null>(null)
  const [hasVoted, setHasVoted] = useState<{ [key: number]: boolean }>({})
  const [zkProofGenerating, setZkProofGenerating] = useState(false)

  const connectWallet = async () => {
    setWalletConnected(true)
    const mockAddress = "0x123456789abcdef123456789abcdef1234567890"
    const mockEns = "voter.eth"

    setWalletAddress(mockAddress)
    setEnsName(mockEns)

    // Check if user is admin
    setIsAdmin(ADMIN_ADDRESSES.includes(mockAddress) || ADMIN_ADDRESSES.includes(mockEns))
  }

  const generateZKProof = async (electionId: number, candidateIndex: number) => {
    setZkProofGenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setZkProofGenerating(false)
    return {
      proof: "zk_proof_0x1a2b3c4d...",
      nullifierHash: "nullifier_0x9876543210...",
      verified: true,
    }
  }

  const castVote = async (electionId: number, candidateIndex: number) => {
    try {
      const zkProof = await generateZKProof(electionId, candidateIndex)

      if (zkProof.verified) {
        setHasVoted((prev) => ({ ...prev, [electionId]: true }))
        // In real implementation: submit to Lisk blockchain with Zama encryption
        console.log(`Vote cast with ZK proof: ${zkProof.proof}`)
        console.log(`Encrypted with Zama: ${zkProof.nullifierHash}`)
      }
    } catch (error) {
      console.error("Error casting vote:", error)
    }
  }

  if (walletConnected && isAdmin) {
    window.location.href = "/admin"
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center space-y-4 pt-6">
            <Shield className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-2xl font-bold">Acceso de Administrador</h2>
            <p className="text-muted-foreground">Redirigiendo al panel de administración...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!walletConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">VoteCryp</CardTitle>
              <CardDescription className="text-base mt-2">Sistema de Votación Descentralizado</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <Network className="h-6 w-6 text-primary mx-auto mb-1" />
                <div className="text-xs font-medium">Lisk Blockchain</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <Lock className="h-6 w-6 text-primary mx-auto mb-1" />
                <div className="text-xs font-medium">Zama Encryption</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <Key className="h-6 w-6 text-primary mx-auto mb-1" />
                <div className="text-xs font-medium">ZK Proofs</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <Zap className="h-6 w-6 text-primary mx-auto mb-1" />
                <div className="text-xs font-medium">ENS Identity</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ens">Nombre ENS (opcional)</Label>
                <Input
                  id="ens"
                  placeholder="tu-nombre.eth"
                  value={ensName}
                  onChange={(e) => setEnsName(e.target.value)}
                />
              </div>
              <Button onClick={connectWallet} className="w-full" size="lg">
                <Wallet className="h-4 w-4 mr-2" />
                Conectar Wallet & Verificar ENS
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p>• Votación anónima con Zero Knowledge Proofs</p>
              <p>• Encriptación homomórfica con Zama</p>
              <p>• Transparencia total en Lisk blockchain</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">VoteCryp</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Wallet className="h-4 w-4 text-primary" />
              <div className="text-right">
                <div className="text-sm font-medium truncate max-w-[120px] sm:max-w-none">{ensName}</div>
                <div className="text-xs text-muted-foreground">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Voting Portal */}
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center space-y-2 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Portal de Votación</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto px-4">
                Voto seguro, transparente y accesible!
              </p>
            </div>

            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Tu identidad está verificada via ENS. Todos los votos son encriptados y anónimos.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              <h3 className="text-lg sm:text-xl font-semibold px-2">Elecciones Activas</h3>
              {mockElections
                .filter((e) => e.status === "active")
                .map((election) => (
                  <Card key={election.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base sm:text-lg break-words">{election.title}</CardTitle>
                          <CardDescription className="text-sm break-words">{election.description}</CardDescription>
                        </div>
                        <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2">
                          <Badge variant="secondary" className="text-xs">Activa</Badge>
                          {election.zkProofVerified && (
                            <Badge variant="outline" className="text-green-600 text-xs">
                              <Key className="h-3 w-3 mr-1" />
                              ZK Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm text-muted-foreground">
                        <span className="break-all sm:break-normal">Lisk TX: {election.liskTxHash.slice(0, 10)}...</span>
                        <span>Votos: {election.totalVotes}</span>
                      </div>

                      {hasVoted[election.id] ? (
                        <Alert>
                          <CheckCircle2 className="h-4 w-4" />
                          <AlertDescription>Voto registrado exitosamente con prueba ZK anónima</AlertDescription>
                        </Alert>
                      ) : selectedElection === election.id ? (
                        <div className="space-y-3 pt-4 border-t">
                          <h4 className="font-medium text-sm sm:text-base">Selecciona tu opción:</h4>
                          {zkProofGenerating && (
                            <Alert>
                              <Zap className="h-4 w-4 animate-spin" />
                              <AlertDescription className="text-sm">Generando prueba Zero Knowledge...</AlertDescription>
                            </Alert>
                          )}
                          <div className="space-y-2">
                            {election.candidates.map((candidate, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                className="w-full justify-start bg-transparent text-left text-sm sm:text-base"
                                onClick={() => castVote(election.id, index)}
                                disabled={zkProofGenerating}
                              >
                                <Lock className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span className="truncate">{candidate.name}</span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Button onClick={() => setSelectedElection(election.id)} className="w-full">
                          <Vote className="h-4 w-4 mr-2" />
                          Votar con ZK Proof
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          {/* Results Dashboard for Voters */}
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center space-y-2 sm:space-y-4 px-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Resultados en Tiempo Real</h2>
              <p className="text-muted-foreground">Resultados transparentes verificables en Lisk blockchain</p>
            </div>

            <div className="grid gap-4 sm:gap-6">
              {mockElections.map((election) => (
                <Card key={election.id}>
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg sm:text-xl break-words">{election.title}</CardTitle>
                        <CardDescription className="text-sm break-words">{election.description}</CardDescription>
                      </div>
                      <Badge variant={election.status === "active" ? "secondary" : "outline"} className="self-start text-xs">
                        {election.status === "active" ? "En Curso" : "Finalizada"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-xl sm:text-2xl font-bold text-primary">{election.totalVotes}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Votos Totales</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-xl sm:text-2xl font-bold text-green-600">100%</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Verificación ZK</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center text-sm sm:text-base">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Resultados por Candidato
                      </h4>
                      {election.candidates.map((candidate, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                            <span className="font-medium text-sm sm:text-base truncate">{candidate.name}</span>
                            <div className="text-left sm:text-right">
                              <span className="font-bold text-primary text-sm sm:text-base">{candidate.votes}</span>
                              <span className="text-xs sm:text-sm text-muted-foreground ml-2">({candidate.percentage}%)</span>
                            </div>
                          </div>
                          <Progress value={candidate.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-4 border-t text-xs sm:text-sm text-muted-foreground">
                      <span className="break-all sm:break-normal">Lisk TX: {election.liskTxHash}</span>
                      <Badge variant="outline" className="text-green-600 self-start sm:self-auto">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verificado en Blockchain
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
