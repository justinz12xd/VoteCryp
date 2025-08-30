import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Lock, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      title: "Registration",
      desc: "Voters register and optionally link ENS for verification.",
      icon: UserPlus,
      color: "text-blue-500",
      bg: "bg-blue-100/40",
    },
    {
      title: "Encryption",
      desc: "Votes are encrypted with Zama on the client before being sent.",
      icon: Lock,
      color: "text-green-500",
      bg: "bg-green-100/40",
    },
    {
      title: "Verification",
      desc: "Transactions are published on Lisk for audit and transparency.",
      icon: CheckCircle,
      color: "text-purple-500",
      bg: "bg-purple-100/40",
    },
  ];

  return (
    <section className="mt-12 mx-2 xl:mx-5">
      <h3 className="text-2xl font-semibold tracking-tight text-center">
        How it works
      </h3>
      <p className="text-muted-foreground text-center max-w-2xl mx-auto mt-2">
        A simple and secure 3-step process ensuring privacy, security, and
        transparency.
      </p>

      <div className="grid gap-6 sm:gap-8 mt-10 md:grid-cols-3">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.title}
              className="p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className={`flex items-center justify-center h-12 w-12 rounded-full ${item.bg}`}
                >
                  <Icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <Badge variant="secondary"></Badge>
                <div className="space-y-1">
                  <h4 className="font-semibold text-lg">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
