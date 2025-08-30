import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Network, Lock, Zap, Shield } from "lucide-react";

export default function FeaturesCard() {
  const features = [
    {
      icon: Network,
      title: "Lisk Blockchain",
      subtitle: "Full transparency",
      color: "text-blue-500",
      bg: "bg-blue-100/40"
    },
    {
      icon: Lock,
      title: "Zama Encryption",
      subtitle: "Anonymous voting",
      color: "text-green-500",
      bg: "bg-green-100/40"
    },
    {
      icon: Zap,
      title: "ENS Identity",
      subtitle: "Verified identity",
      color: "text-yellow-500",
      bg: "bg-yellow-100/40"
    },
    {
      icon: Shield,
      title: "Scalable Deployment",
      subtitle: "Robust architecture",
      color: "text-purple-500",
      bg: "bg-purple-100/40"
    },
  ];

  return (
    <section className="mt-12">
      <Card className="border-none shadow-none">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Key Features</CardTitle>
            <CardDescription className="text-base mt-1 max-w-md mx-auto">
              Privacy, verification, and integrity built into every vote.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-300 bg-card"
                >
                  <div
                    className={`flex items-center justify-center h-12 w-12 rounded-xl ${feature.bg}`}
                  >
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
