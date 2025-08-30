"use client";

import { useState } from "react";
import { LoginProps, LoginSession } from "./types";
import { validateEcuadorCedula } from "../validation/ecuadorCedula";
import { validateFingerprintCode } from "../validation/fingerprintCode";

export function useLogin({ redirectTo = "/", onLogin }: LoginProps) {
  const [ensName, setEnsName] = useState("");
  // New preferred name: sessionAddress. Keep walletAddress for compatibility.
  const [sessionAddress, setSessionAddress] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  // New fields
  const [cedula, setCedula] = useState("");
  const [fingerprintCode, setFingerprintCode] = useState("");

  const validateInputs = () => {
    const c = cedula.trim();
    const f = fingerprintCode.trim();

    // Validación robusta de cédula ecuatoriana (10 dígitos, módulo 10 para naturales)
    const cedulaResult = validateEcuadorCedula(c);
    if (!cedulaResult.valid) return cedulaResult.reason || "Invalid id number";
    const fingerResult = validateFingerprintCode(f);
    if (!fingerResult.valid)
      return fingerResult.reason || "Fingerprint code inválido";
    return null;
  };

  const connectUser = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setConnecting(true);
      setError(null);
      // Call Next API to create a session cookie with cedula + fingerprintCode
      const res = await fetch("/api/auth/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cedula: cedula.trim(),
          fingerprintCode: fingerprintCode.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err?.error || "Authentication failed");
        return;
      }

      const data = await res.json().catch(() => ({} as any));

      // Accept either new sessionAddress or legacy walletAddress from server
      const addr = data?.sessionAddress || "";
      const ens = data?.ensName || ensName || "";

      setSessionAddress(addr);
      setConnected(Boolean(data.connected));

      // Persist a lightweight session so the voting page can recognize login
      try {
        const session: LoginSession = {
          address: addr,
          ens: ens,
          cedula,
          fingerprintCode,
        };
        window.localStorage.setItem("vc_session", JSON.stringify(session));
      } catch {
        // storage not available; continue without persistence
      }

      onLogin?.({
        address: addr,
        ens: ens,
        cedula,
        fingerprintCode,
      });

      if (typeof window !== "undefined" && redirectTo) {
        setTimeout(() => {
          try {
            window.location.assign(redirectTo);
          } catch {}
        }, 600);
      }
    } catch (e) {
      // keep error generic for UX
      setError("Authentication failed. Try again.");
      // eslint-disable-next-line no-console
      console.error("connectUser error:", e);
    } finally {
      setConnecting(false);
    }
  };

  return {
    // state
    ensName,
    setEnsName,
    // expose both names; prefer sessionAddress in new code
    sessionAddress,
    connecting,
    error,
    connected,
    cedula,
    setCedula,
    fingerprintCode,
    setFingerprintCode,
    // actions
    connectUser,
  } as const;
}
