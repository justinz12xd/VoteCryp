import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Network, Lock, Zap, Shield } from "lucide-react";

export default function FeaturesCard() {
  return (
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
            <li>Vote transparency on Lisk: transactions are publicly recorded for audits.</li>
            <li>Zama encryption: votes are encrypted on the client and processed privately.</li>
            <li>ENS for identity: optional verification that doesn't compromise vote anonymity.</li>
          </ul>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          <p>Anonymous voting with Zama encryption</p>
          <p>Identity verified with ENS</p>
          <p>Full transparency on Lisk blockchain</p>
        </div>
      </CardContent>
    </Card>
  );
}
