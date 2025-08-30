"use client";

import { useState } from "react";
import { LoginProps, LoginSession } from "./types";
import { validateEcuadorCedula } from "../validation/ecuadorCedula";

export function useLogin({ redirectTo = "/", onLogin }: LoginProps) {
  const [ensName, setEnsName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
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
  if (!cedulaResult.valid) return cedulaResult.reason || "Cédula inválida";

    if (!f || f.length < 6) return "Ingresa un código dactilar válido";
    if (!/^[A-Za-z0-9-_.]+$/.test(f))
      return "El código dactilar debe ser alfanumérico";
    return null;
  };

  const connectWallet = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setConnecting(true);
      setError(null);
      // Simulación de conexión de wallet (reemplazar por wagmi/rainbowkit si aplica)
      await new Promise((r) => setTimeout(r, 1000));
      const mockAddress = "0x123456789abcdef123456789abcdef1234567890";
      const mockEns = ensName || "voter.eth";

      setWalletAddress(mockAddress);

      setConnected(true);

      // Persist a lightweight session so the voting page can recognize login
      try {
        const session: LoginSession = {
          address: mockAddress,
          ens: mockEns,
          cedula,
          fingerprintCode,
        };
        window.localStorage.setItem("vc_session", JSON.stringify(session));
      } catch {
        // storage not available; continue without persistence
      }

      onLogin?.({
        address: mockAddress,
        ens: mockEns,
        cedula,
        fingerprintCode,
      });

      // Redirección opcional tras conectar
      if (typeof window !== "undefined" && redirectTo) {
        // Dar un pequeño tiempo para que el usuario vea el estado
        setTimeout(() => {
          try {
            window.location.assign(redirectTo);
          } catch {
            // noop si no se puede redirigir (por ejemplo si es usado en un modal)
          }
        }, 600);
      }
    } catch {
      setError("No se pudo conectar la wallet. Inténtalo de nuevo.");
    } finally {
      setConnecting(false);
    }
  };

  return {
    // state
    ensName,
    setEnsName,
    walletAddress,
    connecting,
    error,
    connected,
    cedula,
    setCedula,
    fingerprintCode,
    setFingerprintCode,
    // actions
    connectWallet,
  } as const;
}
