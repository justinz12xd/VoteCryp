import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HowItWorks() {
  return (
    <section className="mt-12">
      <h3 className="text-2xl font-bold">How it works</h3>
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Badge>1</Badge>
            <div>
              <h4 className="font-semibold">Registration</h4>
              <p className="text-sm text-muted-foreground">Voters register and optionally link ENS for verification.</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Badge>2</Badge>
            <div>
              <h4 className="font-semibold">Encryption</h4>
              <p className="text-sm text-muted-foreground">Votes are encrypted with Zama on the client before submission.</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Badge>3</Badge>
            <div>
              <h4 className="font-semibold">Verification</h4>
              <p className="text-sm text-muted-foreground">Transactions are sent to Lisk for public record and audit.</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
