import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function Hero() {
  return (
    <div className="space-y-6 ml-8">
      <div className="flex items-start gap-3 ">
        <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">VoteCryp</h1>
          <p className="text-sm text-muted-foreground">Decentralized, private and verifiable voting</p>
        </div>
      </div>

      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
        A modern, privacy‑first voting platform that blends Lisk transparency,
        Zama encryption, and optional ENS identity. Clear. Auditable. Simple.
      </p>

      <div className="flex flex-wrap gap-3">
        <Link href="/voting">
          <Button size="lg" className="min-w-[160px]">Ir a votar</Button>
        </Link>
      </div>
    </div>
  );
}
