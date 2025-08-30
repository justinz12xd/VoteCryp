"use client";

import { useEffect, useState } from "react";

export default function ResultsOnchainPage() {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/go-results", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "failed");
        if (mounted) setData(json);
      } catch (e: any) {
        if (mounted) setErr(e?.message || "error");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Results (Go API)</h1>
      {err && <pre className="text-red-600">{err}</pre>}
      <pre className="text-xs bg-muted p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
