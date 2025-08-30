import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Shield, Vote, Lock, Zap } from "lucide-react";

import WalletInfo from "@/features/shared/components/WalletInfo";

export default function Navigation(): React.ReactNode {
  return (



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
          <WalletInfo ensName={ensName} walletAddress={walletAddress} />
        </div>
      </div>
    </div>
  </header>;
      )
}
