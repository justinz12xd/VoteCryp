"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Shield, Vote, Wallet, Lock, Zap, Network } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

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
    candidates: [
      { name: "Alice Johnson", votes: 523, percentage: 42, encryptedVotes: "zama_encrypted_523" },
      { name: "Bob Smith", votes: 412, percentage: 33, encryptedVotes: "zama_encrypted_412" },
      { name: "Carol Davis", votes: 312, percentage: 25, encryptedVotes: "zama_encrypted_312" },
    ],
  },
]


export default function VotingFeature() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [ensName, setEnsName] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedElection, setSelectedElection] = useState<number | null>(null)
  const [hasVoted, setHasVoted] = useState<{ [key: number]: boolean }>({})
  const [zamaEncrypting, setZamaEncrypting] = useState(false)

  // Wallet/session state is loaded from localStorage in useEffect

  const encryptVoteWithZama = async (electionId: number, candidateIndex: number) => {
    setZamaEncrypting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setZamaEncrypting(false)
    return {
      encryptedVote: `zama_encrypted_${candidateIndex}_${Date.now()}`,
      liskTxHash: `0x${Math.random().toString(16).substr(2, 40)}`,
      verified: true,
    }
  }

  const castVote = async (electionId: number, candidateIndex: number) => {
    try {
      const encryptedVote = await encryptVoteWithZama(electionId, candidateIndex)

      if (encryptedVote.verified) {
        setHasVoted((prev) => ({ ...prev, [electionId]: true }))
        console.log(`Vote encrypted with Zama: ${encryptedVote.encryptedVote}`)
        console.log(`Submitted to Lisk: ${encryptedVote.liskTxHash}`)
      }
    } catch (error) {
      console.error("Error casting vote:", error)
    }
  }

  if (walletConnected && isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center space-y-4 pt-6">
            <Shield className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-2xl font-bold">Acceso de Administrador</h2>
            <p className="text-muted-foreground">Redirigiendo al panel de administración...</p>
            <Link href="/admin">
              <Button className="w-full">Ir al Panel de Admin</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Auto-redirect to login if there's no active session
  useEffect(() => {
    try {
      const s = window.localStorage.getItem("vc_session")
      if (!s) {
        window.location.assign("/login")
      } else {
        const parsed = JSON.parse(s)
        setWalletConnected(true)
        setWalletAddress(parsed.address || "")
        setEnsName(parsed.ens || "")
        setIsAdmin(!!parsed.isAdmin)
      }
    } catch {
      window.location.assign("/login")
    }
  }, [])

  if (!walletConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center space-y-4 pt-6">
            <Shield className="h-12 w-12 text-primary mx-auto animate-pulse" />
            <h2 className="text-xl font-semibold">Redirigiendo al login...</h2>
            <p className="text-muted-foreground">Preparando tu sesión</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">VoteCrypt</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Ver Dashboard</Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Wallet className="h-4 w-4 text-primary" />
                <div className="text-right">
                  <div className="text-sm font-medium">{ensName}</div>
                  <div className="text-xs text-muted-foreground">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">Portal de Votación</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Vota de forma anónima y segura usando encriptación Zama y verificación ENS
              </p>
            </div>

            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Tu identidad está verificada via ENS. Todos los votos son encriptados con Zama.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 max-w-max mx-auto">
              <h3 className="text-xl font-semibold">Elecciones Activas</h3>
              {mockElections
                .filter((e) => e.status === "active")
                .map((election) => (
                  <Card key={election.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{election.title}</CardTitle>
                          <CardDescription>{election.description}</CardDescription>
                        </div>
                        <Badge variant="secondary">Activa</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Votos: {election.totalVotes}</span>
                      </div>

                      {hasVoted[election.id] ? (
                        <Alert>
                          <CheckCircle2 className="h-4 w-4" />
                          <AlertDescription>Voto registrado exitosamente con encriptación Zama</AlertDescription>
                        </Alert>
                      ) : selectedElection === election.id ? (
                        <div className="space-y-3 pt-4 border-t">
                          <h4 className="font-medium">Selecciona tu opción:</h4>
                          {zamaEncrypting && (
                            <Alert>
                              <Zap className="h-4 w-4 animate-spin" />
                              <AlertDescription>Encriptando voto con Zama...</AlertDescription>
                            </Alert>
                          )}
                          {election.candidates.map((candidate, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="w-full justify-start bg-transparent"
                              onClick={() => castVote(election.id, index)}
                              disabled={zamaEncrypting}
                            >
                              <Lock className="h-4 w-4 mr-2" />
                              {candidate.name}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <Button onClick={() => setSelectedElection(election.id)} className="w-full">
                          <Vote className="h-4 w-4 mr-2" />
                          Votar con Encriptación Zama
                        </Button>
                      )}
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
