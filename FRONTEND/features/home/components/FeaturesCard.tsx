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
      subtitle: "Full transparency"
    },
    {
      icon: Lock,
      title: "Zama Encryption", 
      subtitle: "Anonymous voting"
    },
    {
      icon: Zap,
      title: "ENS Identity",
      subtitle: "Verified identity"  
    },
    {
      icon: Shield,
      title: "Scalable Deployment",
      subtitle: "Robust architecture"
    }
  ];

  return (
    <Card>
      <CardHeader className="text-center space-y-3">
        <div className="flex justify-center">
          <Shield className="h-10 w-10 text-primary text-xl" />
        </div>
        <div>
          <CardTitle className="text-xl">Features</CardTitle>
          <CardDescription className="text-sm mt-1">
            Privacy, verification, and integrity in every vote.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {/* Clean vertical feature list */}
        <div className="space-y-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="flex-1 font-xl">
                  <div className="text-base font-bold">{feature.title}</div>
                  <div className="text-base text-muted-foreground">
                    {feature.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
