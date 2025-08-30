"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  Wallet,
  Zap,
  ArrowRight,
  Fingerprint,
  IdCard,
} from "lucide-react";
import { useLogin } from "./useLogin";
import type { LoginProps } from "./types";
import Link from "next/link";

export function LoginForm(props: LoginProps) {
  const {
    ensName,
    walletAddress,
    connecting,
    error,
    connected,
    cedula,
    setCedula,
    fingerprintCode,
    setFingerprintCode,
    connectUser,
  } = useLogin(props);

  return (
    <div className="min-h-[70vh] sm:min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl sm:text-2xl">VoteCryp</CardTitle>
            <CardDescription className="text-sm sm:text-base mt-1">
              Log in to continue
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {connected && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Logged in as {ensName || "usuario"}.{" "}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert>
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="cedula" className="text-sm">
                  ID
                </Label>
                <IdCard className="h-4 w-4 text-muted-foreground" />
              </div>

              <Input
                id="cedula"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="1234567890"
                autoComplete="off"
                value={cedula}
                onChange={(e) => setCedula(e.target.value.replace(/\D/g, ""))}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="finger" className="text-sm">
                  Fingerprint code
                </Label>
                <Fingerprint className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="finger"
                placeholder="ABC1234"
                autoComplete="off"
                value={fingerprintCode}
                onChange={(e) => setFingerprintCode(e.target.value)}
                className="text-sm"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              This data is used only for voter identification and is not stored.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={connectUser}
              className="w-full"
              size="lg"
              disabled={connecting}
            >
              {connecting ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4 mr-2" />
                  Ingresar
                </>
              )}
            </Button>
          </div>
          {walletAddress && (
            <div className="flex items-center justify-between text-[11px] sm:text-xs text-muted-foreground border-t pt-4">
              <span>Wallet</span>
              <span className="font-medium">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            </div>
          )}

          {!connected && (
            <div className="flex justify-end">
              <Link
                href="/results"
                className="flex items-center hover:text-primary"
              >
                Skip and see results
                <ArrowRight className="h-3.5 w-3.5 ml-2" />
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginForm;
