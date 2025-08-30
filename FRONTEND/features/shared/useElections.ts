import { useState, useEffect, useCallback } from "react";
import type { Election } from "./types";

export default function useElections() {
  const [elections, setElections] = useState<Election[]>([]);
  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/elections", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) setElections(data as Election[]);
    } catch {
      setElections([]);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await load();
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { elections, refetch: load };
}
