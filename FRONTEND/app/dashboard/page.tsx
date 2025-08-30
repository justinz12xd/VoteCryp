"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Shield, BarChart3, Network, ArrowLeft, TrendingUp, Users, Vote } from "lucide-react"
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
  {
    id: 2,
    title: "Propuesta de Mejoras",
    description: "Votación sobre implementación de nuevas características",
    status: "completed",
    startDate: "2024-01-01",
    endDate: "2024-01-14",
    totalVotes: 892,
    liskTxHash: "0x9876543210fedcba0987654321",
    candidates: [
      { name: "A favor", votes: 634, percentage: 71, encryptedVotes: "zama_encrypted_634" },
      { name: "En contra", votes: 258, percentage: 29, encryptedVotes: "zama_encrypted_258" },
    ],
  },
]

export default function Dashboard() {
  const totalVotes = mockElections.reduce((sum, election) => sum + election.totalVotes, 0)
  const activeElections = mockElections.filter((e) => e.status === "active").length
  const completedElections = mockElections.filter((e) => e.status === "completed").length

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Dashboard de Votos</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-primary">
                <Network className="h-3 w-3 mr-1" />
                Lisk Mainnet
              </Badge>
              <Badge variant="outline" className="text-green-600">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                En Vivo
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Vote className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-primary">{totalVotes}</p>
                    <p className="text-sm text-muted-foreground">Votos Totales</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">{activeElections}</p>
                    <p className="text-sm text-muted-foreground">Elecciones Activas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{completedElections}</p>
                    <p className="text-sm text-muted-foreground">Completadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">100%</p>
                    <p className="text-sm text-muted-foreground">Verificación Zama</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Elections Results */}
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">Resultados por Candidato</h2>
              <p className="text-muted-foreground">Resultados transparentes verificables en Lisk blockchain</p>
            </div>

            <div className="grid gap-6">
              {mockElections.map((election) => (
                <Card key={election.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{election.title}</CardTitle>
                        <CardDescription>{election.description}</CardDescription>
                      </div>
                      <Badge variant={election.status === "active" ? "secondary" : "outline"}>
                        {election.status === "active" ? "En Curso" : "Finalizada"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">{election.totalVotes}</div>
                        <div className="text-sm text-muted-foreground">Votos Totales</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-green-600">100%</div>
                        <div className="text-sm text-muted-foreground">Encriptación Zama</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {election.status === "active" ? "En Vivo" : "Cerrada"}
                        </div>
                        <div className="text-sm text-muted-foreground">Estado</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Votos por Candidato
                      </h4>
                      {election.candidates.map((candidate, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{candidate.name}</span>
                            <div className="text-right">
                              <span className="font-bold text-primary text-lg">{candidate.votes}</span>
                              <span className="text-sm text-muted-foreground ml-2">({candidate.percentage}%)</span>
                            </div>
                          </div>
                          <Progress value={candidate.percentage} className="h-3" />
                          <div className="text-xs text-muted-foreground">Zama Hash: {candidate.encryptedVotes}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t text-sm text-muted-foreground">
                      <span>Lisk TX: {election.liskTxHash}</span>
                      <Badge variant="outline" className="text-green-600">
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
