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
import { CheckCircle2, Shield, Vote, Lock, Zap } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useElections } from "../shared";
import useWallet from "../shared/useWallet";
import type { Election } from "../shared/types";

export function VotingFeature() {
  const { connected: walletConnected } = useWallet();
  const [selectedElection, setSelectedElection] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState<{ [key: number]: boolean }>({});
  const [zamaEncrypting, setZamaEncrypting] = useState(false);

  const { elections } = useElections();

  const castVote = async (electionId: number, candidateIndex: number) => {
    try {
      setZamaEncrypting(true);
      // Backend route will handle register/login and encryption+submit
      const cedula = "demo-voter";
      const fingerprintCode = "demo-code";
      const res = await fetch("/api/submit-vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ electionId, candidateIndex, cedula, fingerprintCode }),
      });
      const data = await res.json();
      setZamaEncrypting(false);
      if (!res.ok) {
        console.error("submit vote failed", data);
        return;
      }
      setHasVoted((prev) => ({ ...prev, [electionId]: true }));
    } catch (error) {
      setZamaEncrypting(false);
      console.error("Error casting vote:", error);
    }
  };

  const renderActionArea = (election: Election) => {
    if (hasVoted[election.id]) {
      return (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Vote successfully recorded with Zama encryption
          </AlertDescription>
        </Alert>
      );
    }

    if (selectedElection === election.id) {
      return (
        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-medium">Select your option:</h4>
          {zamaEncrypting && (
            <Alert>
              <Zap className="h-4 w-4 animate-spin" />
              <AlertDescription>Encrypting vote with Zama...</AlertDescription>
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
        Vote with Zama Encryption
      </Button>
    );
  };

  if (walletConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center space-y-4 pt-6">
            <Shield className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-2xl font-bold">Admin Access</h2>
            <p className="text-muted-foreground">
              Redirecting to the admin dashboard...
            </p>
            <Link href="/admin">
              <Button className="w-full">Go to Admin Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                Voting Portal
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Vote anonymously and securely using Zama encryption and ENS
                verification
              </p>
            </div>

            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                Your identity is verified via ENS. All votes are encrypted with
                Zama.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              <h3 className="text-xl font-semibold">Active Elections</h3>
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
                        <Badge variant="secondary">Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          Lisk TX: {election.liskTxHash.slice(0, 10)}...
                        </span>
                        <span>Votes: {election.totalVotes}</span>
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
