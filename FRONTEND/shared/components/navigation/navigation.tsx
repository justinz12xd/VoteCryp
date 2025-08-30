"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";


export function Navigation(): React.ReactNode {
  const pathname = usePathname();


  // Hide global site header on dashboard/results pages to avoid double headers
  if (pathname?.startsWith("/results")) {
    return null;
  }

  return (
    <header className="border-b bg-card" role="banner">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {/* Decorative branding icon - hide from AT */}
              <Shield className="h-8 w-8 text-primary" aria-hidden="true" />
              {/* Make the site title a link to home for keyboard users */}
              <Link
                href="/"
                aria-label="VoteCrypt home"
                className="text-2xl font-bold text-foreground focus:outline-none"
              >
                VoteCrypt
              </Link>
            </div>
          </div>
          <nav aria-label="Primary navigation">
            <div className="flex items-center space-x-4">
              <Link href="/results">
                <Button variant="outline">See results</Button>
              </Link>
              <Link href="/voting">
                <Button variant="outline">Vote now</Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
