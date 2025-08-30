import { useEffect, useState } from "react";

type WalletState = {
  connected: boolean;
  // new canonical name
  sessionAddress?: string;
  walletAddress?: string;
  ensName?: string;
};

export default function useWallet() {
  const [state, setState] = useState<WalletState>({ connected: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchWallet() {
      try {
        // the backend exposes an auth-backed endpoint which verifies id+fingerprint
        const res = await fetch("/api/auth/wallet");
        if (!res.ok) throw new Error("failed to fetch wallet");
        const data = await res.json();
        if (mounted) {
          const addr = data.sessionAddress || data.walletAddress || "";
          setState({
            connected: Boolean(data.connected),
            sessionAddress: addr,
            walletAddress: addr,
            ensName: data.ensName || "",
          });
        }
      } catch (err) {
        // Log for diagnostics and satisfy linter
        // eslint-disable-next-line no-console
        console.debug("fetchWallet error", err);
        if (mounted) {
          setState({ connected: false });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchWallet();

    return () => {
      mounted = false;
    };
  }, []);

  return { ...state, loading };
}
