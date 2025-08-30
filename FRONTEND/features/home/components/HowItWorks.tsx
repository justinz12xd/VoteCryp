import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HowItWorks() {
  return (
    <section className="mt-12">
      <h3 className="text-2xl font-semibold tracking-tight">How it works</h3>
      <div className="grid gap-4 sm:gap-6 mt-6 md:grid-cols-3 ">
        {[{
          step: 1,
          title: 'Registration',
          desc: 'Voters register and optionally link ENS for verification.'
        },{
          step: 2,
          title: 'Encryption',
          desc: 'Votes are encrypted with Zama on the client before being sent.'
        },{
          step: 3,
          title: 'Verification',
          desc: 'Transactions are published on Lisk for audit and transparency.'
        }].map((item) => (
          <Card key={item.step} className="p-4 sm:p-5 ">
            <div className="flex items-start gap-3">
              <Badge
                variant="secondary"
                className="rounded-full h-7 w-7 p-0 flex items-center justify-center text-sm bg-green-100 text-black font-bold"
              >
                {item.step}
              </Badge>
              <div className="space-y-1 ">
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
