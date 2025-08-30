"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Shield,
  Vote,
  BarChart3,
  Settings,
  Menu,
  Network,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  isAdmin?: boolean;
  ensName?: string;
  walletAddress?: string;
}

export function Navigation({
  isAdmin = false,
  ensName,
  walletAddress,
}: NavigationProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const voterRoutes = [
    {
      href: "/",
      label: "Portal de Votación",
      icon: Vote,
      description: "Participa en elecciones activas",
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: BarChart3,
      description: "Ver resultados en tiempo real",
    },
  ];

  const adminRoutes = [
    {
      href: "/admin",
      label: "Panel Admin",
      icon: Settings,
      description: "Gestionar elecciones y votantes",
    },
  ];

  const routes = isAdmin ? [...voterRoutes, ...adminRoutes] : voterRoutes;

  const NavContent = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-lg font-bold">VoteChain</h2>
          <p className="text-xs text-muted-foreground">
            Sistema Descentralizado
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-primary">
            <Network className="h-3 w-3 mr-1" />
            Lisk Mainnet
          </Badge>
          <Badge variant="outline" className="text-green-600">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Conectado
          </Badge>
        </div>
      </div>

      {ensName && walletAddress && (
        <div className="p-3 bg-muted rounded-lg">
          <div className="text-sm font-medium">{ensName}</div>
          <div className="text-xs text-muted-foreground">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </div>
          {isAdmin && (
            <Badge variant="secondary" className="mt-1">
              Administrador
            </Badge>
          )}
        </div>
      )}

      <nav className="space-y-2">
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = pathname === route.href;

          return (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-muted",
                isActive &&
                  "bg-primary/10 text-primary border border-primary/20"
              )}
            >
              <Icon className="h-5 w-5" />
              <div>
                <div className="font-medium">{route.label}</div>
                <div className="text-xs text-muted-foreground">
                  {route.description}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t">
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Encriptación Zama FHE</p>
          <p>• Identidad ENS verificada</p>
          <p>• Blockchain Lisk transparente</p>
          <p>• Deploy optimizado Vercel</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block w-80 border-r bg-card">
        <div className="p-6">
          <NavContent />
        </div>
      </div>
    </>
  );
}
