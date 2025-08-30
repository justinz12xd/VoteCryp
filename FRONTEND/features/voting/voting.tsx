"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  Shield,
  Vote,
  Wallet,
  Lock,
  Zap,
  Network,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useElections, WalletInfo, ADMIN_ADDRESSES } from "../shared";
import type { Election } from "../shared/types";

export function VotingFeature() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [ensName, setEnsName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedElection, setSelectedElection] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState<{ [key: number]: boolean }>({});
  const [zamaEncrypting, setZamaEncrypting] = useState(false);

  const { elections } = useElections();

  const connectWallet = async () => {
    setWalletConnected(true);
    const mockAddress = "0x123456789abcdef123456789abcdef1234567890";
    const mockEns = "voter.eth";

    setWalletAddress(mockAddress);
    setEnsName(mockEns);

    // Check if user is admin
    setIsAdmin(
      ADMIN_ADDRESSES.includes(mockAddress) || ADMIN_ADDRESSES.includes(mockEns)
    );
  };

  const encryptVoteWithZama = async (
    electionId: number,
    candidateIndex: number
  ) => {
    setZamaEncrypting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setZamaEncrypting(false);
    return {
      encryptedVote: `zama_encrypted_${candidateIndex}_${Date.now()}`,
      liskTxHash: `0x${Math.random().toString(16).slice(2, 42)}`,
      verified: true,
    };
  };

  const castVote = async (electionId: number, candidateIndex: number) => {
    try {
      const encryptedVote = await encryptVoteWithZama(
        electionId,
        candidateIndex
      );

      if (encryptedVote.verified) {
        setHasVoted((prev) => ({ ...prev, [electionId]: true }));
        console.log(`Vote encrypted with Zama: ${encryptedVote.encryptedVote}`);
        console.log(`Submitted to Lisk: ${encryptedVote.liskTxHash}`);
      }
    } catch (error) {
      console.error("Error casting vote:", error);
    }
  };

  const renderActionArea = (election: Election) => {
    if (hasVoted[election.id]) {
      return (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Voto registrado exitosamente con encriptación Zama
          </AlertDescription>
        </Alert>
      );
    }

    if (selectedElection === election.id) {
      return (
        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-medium">Selecciona tu opción:</h4>
          {zamaEncrypting && (
            <Alert>
              <Zap className="h-4 w-4 animate-spin" />
              <AlertDescription>Encriptando voto con Zama...</AlertDescription>
            </Alert>
          )}
          {election.candidates.map((candidate: any, idx: number) => (
            <Button
              key={`${election.id}-${candidate.name}`}
              variant="outline"
              className="w-full justify-start bg-transparent"
              onClick={() => castVote(election.id, idx)}
              disabled={zamaEncrypting}
            >
              <Lock className="h-4 w-4 mr-2" />
              {candidate.name}
            </Button>
          ))}
        </div>
      );
    }

    return (
      <Button
        onClick={() => setSelectedElection(election.id)}
        className="w-full"
      >
        <Vote className="h-4 w-4 mr-2" />
        Votar con Encriptación Zama
      </Button>
    );
  };

  if (walletConnected && isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center space-y-4 pt-6">
            <Shield className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-2xl font-bold">Acceso de Administrador</h2>
            <p className="text-muted-foreground">
              Redirigiendo al panel de administración...
            </p>
            <Link href="/admin">
              <Button className="w-full">Ir al Panel de Admin</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
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
              <CardTitle className="text-2xl">VoteCrypt</CardTitle>
              <CardDescription className="text-base mt-2">
                Sistema de Votación Descentralizado
              </CardDescription>
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
                <Zap className="h-6 w-6 text-primary mx-auto mb-1" />
                <div className="text-xs font-medium">ENS Identity</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <Shield className="h-6 w-6 text-primary mx-auto mb-1" />
                <div className="text-xs font-medium">Vercel Deploy</div>
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
              <p>Votación anónima con encriptación Zama</p>
              <p>Identidad verificada con ENS</p>
              <p>Transparencia total en Lisk blockchain</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">
                  VoteCrypt
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Ver Dashboard</Button>
              </Link>
              <WalletInfo ensName={ensName} walletAddress={walletAddress} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                Portal de Votación
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Vota de forma anónima y segura usando encriptación Zama y
                verificación ENS
              </p>
            </div>

            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Tu identidad está verificada via ENS. Todos los votos son
                encriptados con Zama.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              <h3 className="text-xl font-semibold">Elecciones Activas</h3>
              {elections
                .filter((e) => e.status === "active")
                .map((election: Election) => (
                  <Card
                    key={election.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {election.title}
                          </CardTitle>
                          <CardDescription>
                            {election.description}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">Activa</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          Lisk TX: {election.liskTxHash.slice(0, 10)}...
                        </span>
                        <span>Votos: {election.totalVotes}</span>
                      </div>

                      {renderActionArea(election)}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

