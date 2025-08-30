import { useState, useEffect } from "react";
import type { Election } from "./types";

export default function useElections() {
  const [elections, setElections] = useState<Election[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/elections", { cache: "no-store" });
        const data = await res.json();
        if (mounted && Array.isArray(data)) setElections(data as Election[]);
      } catch {
        // fallback: no elections
        if (mounted) setElections([]);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { elections };
}
