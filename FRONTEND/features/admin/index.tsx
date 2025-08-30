"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Users, Shield, Network, Lock, Zap, ArrowLeft, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock admin addresses
const ADMIN_ADDRESSES = ["0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e1e1", "admin.eth", "dao-admin.eth"]

export default function AdminFeature() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [walletAddress, setWalletAddress] = useState("")
  const [ensName, setEnsName] = useState("")

  const [newElection, setNewElection] = useState({
    title: "",
    description: "",
    type: "",
    startDate: "",
    endDate: "",
    candidates: ["", ""],
  })

  useEffect(() => {
    const checkAdminAccess = async () => {
      // Simulate wallet connection check
      const mockAddress = "0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e1e1"
      const mockEns = "admin.eth"

      setWalletAddress(mockAddress)
      setEnsName(mockEns)

      const isAdmin = ADMIN_ADDRESSES.includes(mockAddress) || ADMIN_ADDRESSES.includes(mockEns)
      setIsAuthenticated(isAdmin)
      setIsLoading(false)
    }

    checkAdminAccess()
  }, [])

  const addCandidate = () => {
    setNewElection((prev) => ({
      ...prev,
      candidates: [...prev.candidates, ""],
    }))
  }

  const updateCandidate = (index: number, value: string) => {
    setNewElection((prev) => ({
      ...prev,
      candidates: prev.candidates.map((c, i) => (i === index ? value : c)),
    }))
  }

  const createElection = async () => {
    console.log("Deploying election to Lisk blockchain...")
    console.log("Setting up Zama encryption...")
    alert("Elección creada exitosamente en Lisk blockchain")

    // Reset form
    setNewElection({
      title: "",
      description: "",
      type: "",
      startDate: "",
      endDate: "",
      candidates: ["", ""],
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center space-y-4 pt-6">
            <Zap className="h-12 w-12 text-primary mx-auto animate-spin" />
            <h2 className="text-xl font-semibold">Verificando acceso...</h2>
            <p className="text-muted-foreground">Conectando con Lisk blockchain</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center space-y-4 pt-6">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">Acceso Denegado</h2>
            <p className="text-muted-foreground">No tienes permisos de administrador para acceder a este panel</p>
            <Button onClick={() => (window.location.href = "/")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Portal de Votación
            </Button>
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
              <Button variant="ghost" onClick={() => (window.location.href = "/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Panel de Administración</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-primary">
                  <Network className="h-3 w-3 mr-1" />
                  Lisk Mainnet
                </Badge>
                <Badge variant="outline" className="text-green-600">
                  Admin Verificado
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Crear Nueva Elección</span>
              </CardTitle>
              <CardDescription>Despliega una nueva votación en Lisk blockchain con encriptación Zama</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Network className="h-4 w-4" />
                <AlertDescription>
                  La elección se desplegará como smart contract en Lisk blockchain con encriptación Zama
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título de la Elección</Label>
                  <Input
                    id="title"
                    placeholder="Ej: Elección de Presidente DAO 2024"
                    value={newElection.title}
                    onChange={(e) => setNewElection((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Votación</Label>
                  <Select
                    value={newElection.type}
                    onValueChange={(value) => setNewElection((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Opción única</SelectItem>
                      <SelectItem value="multiple">Opción múltiple</SelectItem>
                      <SelectItem value="ranked">Votación clasificada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe el propósito y contexto de esta elección..."
                  rows={3}
                  value={newElection.description}
                  onChange={(e) => setNewElection((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start">Fecha de Inicio</Label>
                  <Input
                    id="start"
                    type="datetime-local"
                    value={newElection.startDate}
                    onChange={(e) => setNewElection((prev) => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end">Fecha de Fin</Label>
                  <Input
                    id="end"
                    type="datetime-local"
                    value={newElection.endDate}
                    onChange={(e) => setNewElection((prev) => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Candidatos/Opciones</Label>
                <div className="space-y-2">
                  {newElection.candidates.map((candidate, index) => (
                    <Input
                      key={`candidate-${index}-${candidate}`}
                      placeholder={`Candidato ${index + 1}`}
                      value={candidate}
                      onChange={(e) => updateCandidate(index, e.target.value)}
                    />
                  ))}
                  <Button variant="outline" size="sm" onClick={addCandidate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Candidato
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Configuración Blockchain</Label>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>• Smart Contract: Lisk L2</div>
                    <div>• Encriptación: Zama FHE</div>
                    <div>• Identidad: ENS Registry</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Estimación de Gas</Label>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>• Deploy: ~0.05 LSK</div>
                    <div>• Por voto: ~0.001 LSK</div>
                    <div>• Total estimado: ~0.1 LSK</div>
                  </div>
                </div>
              </div>

              <Button onClick={createElection} className="w-full" size="lg">
                <Network className="h-4 w-4 mr-2" />
                Desplegar Elección en Lisk Blockchain
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Gestión de Votantes</span>
              </CardTitle>
              <CardDescription>Administra la elegibilidad y verificación de identidades ENS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">1,247</div>
                  <div className="text-sm text-muted-foreground">Identidades ENS</div>
                  <div className="text-xs text-muted-foreground mt-1">Verificadas</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-accent">892</div>
                  <div className="text-sm text-muted-foreground">Votos Encriptados</div>
                  <div className="text-xs text-muted-foreground mt-1">Procesados</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">71%</div>
                  <div className="text-sm text-muted-foreground">Participación</div>
                  <div className="text-xs text-muted-foreground mt-1">Tiempo real</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="eligibility">Criterios de Elegibilidad</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar criterio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ens">Poseedores de ENS</SelectItem>
                      <SelectItem value="dao">Miembros de DAO</SelectItem>
                      <SelectItem value="token">Holders de Token LSK</SelectItem>
                      <SelectItem value="whitelist">Lista Blanca Verificada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="bg-transparent">
                    <Zap className="h-4 w-4 mr-2" />
                    Sincronizar ENS Registry
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    <Lock className="h-4 w-4 mr-2" />
                    Exportar Claves Zama
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
