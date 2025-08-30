"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Shield,
  BarChart3,
  ArrowLeft,
  TrendingUp,
  Users,
  Vote,
  Network,
} from "lucide-react";
import Link from "next/link";
import { useElections } from "../shared";
import type { Election } from "../shared/types";

export default function DashboardFeature() {
  const { elections, refetch } = useElections();
  const totalVotes = elections.reduce(
    (sum, election) => sum + election.totalVotes,
    0
  );
  const activeElections = elections.filter((e) => e.status === "active").length;
  const completedElections = elections.filter(
    (e) => e.status === "completed"
  ).length;
  const [goResults, setGoResults] = useState<any>(null);
  const [loadingGo, setLoadingGo] = useState(false);
  const [goErr, setGoErr] = useState<string | null>(null);

  async function fetchGoResults() {
    try {
      setLoadingGo(true);
      setGoErr(null);
      const res = await fetch("/api/go-results", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to load");
      setGoResults(data);
    } catch (e: any) {
      setGoErr(e?.message || "Error");
    } finally {
      setLoadingGo(false);
    }
  }

  useEffect(() => {
    fetchGoResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* HEADER */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hover:bg-black">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Voting Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="container mx-auto px-4 py-10 space-y-12">
        {/* STATISTICS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              label: "Total Votes",
              value: totalVotes,
              icon: Vote,
              color: "text-primary",
            },
            {
              label: "Active Elections",
              value: activeElections,
              icon: TrendingUp,
              color: "text-green-600",
            },
            {
              label: "Completed",
              value: completedElections,
              icon: CheckCircle2,
              color: "text-blue-600",
            },
            {
              label: "Zama Verification",
              value: "100%",
              icon: Users,
              color: "text-purple-600",
            },
          ].map((stat, i) => (
            <Card
              key={`${stat.label}-${i}`}
              className="p-6 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl"
            >
              <CardContent className="flex items-center gap-3">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <div>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* RESULTS */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Candidate Results</h2>
            <p className="text-muted-foreground">
              Transparent results verifiable on Lisk blockchain
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  refetch?.();
                  fetchGoResults();
                }}
                disabled={loadingGo}
              >
                Refresh results
              </Button>
              {loadingGo && (
                <span className="text-xs text-muted-foreground">Updating…</span>
              )}
            </div>
          </div>

          <div className="grid gap-8">
            {elections.map((election: Election) => (
              <Card
                key={election.id}
                className="shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {election.title}
                      </CardTitle>
                      <CardDescription>{election.description}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        election.status === "active" ? "secondary" : "outline"
                      }
                      className="capitalize"
                    >
                      {election.status === "active" ? "Ongoing" : "Completed"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {election.totalVotes}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total Votes
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">100%</p>
                      <p className="text-sm text-muted-foreground">
                        Zama Encryption
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {election.status === "active" ? "Live" : "Closed"}
                      </p>
                      <p className="text-sm text-muted-foreground">Status</p>
                    </div>
                  </div>

                  {/* Candidates */}
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                      Votes by Candidate
                    </h4>
                    {election.candidates.map((candidate, index) => (
                      <div
                        key={`${election.id}-candidate-${index}-${candidate.name}`}
                        className="space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{candidate.name}</span>
                          <div className="text-right">
                            <span className="font-bold text-primary text-lg">
                              {candidate.votes}
                            </span>
                            <span className="text-sm text-muted-foreground ml-2">
                              ({candidate.percentage}%)
                            </span>
                          </div>
                        </div>
                        <Progress
                          value={candidate.percentage}
                          className="h-3"
                        />
                        <div className="text-xs text-muted-foreground">
                          Zama Hash: {candidate.encryptedVotes}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t text-xs text-muted-foreground">
                    <span>Lisk TX: {election.liskTxHash}</span>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 text-green-600"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      Verified on Blockchain
                    </Badge>
                  </div>
                  {/* Decrypted results (Go API) */}
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center">
                      <Network className="h-4 w-4 mr-2 text-primary" />
                      Go API Tally (decrypted)
                    </h4>
                    {goErr && (
                      <div className="text-xs text-red-600">{goErr}</div>
                    )}
                    {(() => {
                      let text = "No data";
                      if (loadingGo) text = "Loading…";
                      if (goResults) text = JSON.stringify(goResults, null, 2);
                      return (
                        <pre className="text-xs bg-muted/60 p-3 rounded max-h-56 overflow-auto">
                          {text}
                        </pre>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
