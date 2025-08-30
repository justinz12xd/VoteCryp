import { Shield, Network, Lock, Code } from "lucide-react";

export function Footer() {
  return (
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
  );
}
