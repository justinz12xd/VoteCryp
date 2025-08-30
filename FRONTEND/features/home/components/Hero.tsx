import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function Hero() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-4xl font-bold text-foreground">VoteCrypt</h1>
          <p className="text-sm text-muted-foreground">
            Decentralized, private and verifiable voting
          </p>
        </div>
      </div>

      <p className="text-lg text-muted-foreground max-w-xl">
        VoteCrypt combines Lisk blockchain transparency with Zama's
        homomorphic-style encryption and ENS identity verification to deliver a
        modern, privacy-first voting platform. Easy to audit, simple to use.
      </p>

      <div className="flex flex-wrap gap-3">
        <Link href="/voting">
          <Button size="lg">View Voting</Button>
        </Link>
      </div>
    </div>
  );
}
