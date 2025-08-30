"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Network, Lock, Zap, Code } from "lucide-react";

export function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Shield className="h-10 w-10 text-primary" />
              <div>
                <h1 className="text-4xl font-bold text-foreground">
                  VoteCrypt
                </h1>
                <p className="text-sm text-muted-foreground">
                  Decentralized, private and verifiable voting
                </p>
              </div>
            </div>

            <p className="text-lg text-muted-foreground max-w-xl">
              VoteCrypt combines Lisk blockchain transparency with Zama's
              homomorphic-style encryption and ENS identity verification to
              deliver a modern, privacy-first voting platform. Easy to audit,
              simple to use.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/voting">
                <Button size="lg">View Voting</Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline" size="lg">
                  Admin Panel
                </Button>
              </Link>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader className="text-center space-y-4">
                <div className="flex justify-center">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Features</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Privacy, verification, and integrity in every vote.
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

                <div className="space-y-2">
                  <h4 className="font-semibold">Technical summary</h4>
                  <ul className="list-inside list-disc text-sm text-muted-foreground">
                    <li>
                      Vote transparency on Lisk: transactions are publicly
                      recorded for audits.
                    </li>
                    <li>
                      Zama encryption: votes are encrypted on the client and
                      processed privately.
                    </li>
                    <li>
                      ENS for identity: optional verification that doesn't
                      compromise vote anonymity.
                    </li>
                  </ul>
                </div>

                <div className="text-xs text-muted-foreground text-center">
                  <p>Anonymous voting with Zama encryption</p>
                  <p>Identity verified with ENS</p>
                  <p>Full transparency on Lisk blockchain</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How it works */}
        <section className="mt-12">
          <h3 className="text-2xl font-bold">How it works</h3>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <Badge>1</Badge>
                <div>
                  <h4 className="font-semibold">Registration</h4>
                  <p className="text-sm text-muted-foreground">
                    Voters register and optionally link ENS for verification.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <Badge>2</Badge>
                <div>
                  <h4 className="font-semibold">Encryption</h4>
                  <p className="text-sm text-muted-foreground">
                    Votes are encrypted with Zama on the client before
                    submission.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <Badge>3</Badge>
                <div>
                  <h4 className="font-semibold">Verification</h4>
                  <p className="text-sm text-muted-foreground">
                    Transactions are sent to Lisk for public record and audit.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Footer / project info */}
        <footer className="mt-12 border-t pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <h5 className="font-bold">VoteCrypt</h5>
                  <p className="text-sm text-muted-foreground">
                    Open-source project for private and verifiable voting
                  </p>
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Code className="h-4 w-4" /> Frontend: Next.js + Tailwind
              </p>
              <p className="flex items-center gap-2">
                <Network className="h-4 w-4" /> Blockchain: Lisk
              </p>
              <p className="flex items-center gap-2">
                <Lock className="h-4 w-4" /> Encryption: Zama
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
