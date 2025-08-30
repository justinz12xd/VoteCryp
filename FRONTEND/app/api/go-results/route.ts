import { NextRequest, NextResponse } from "next/server";

const GO_API_URL =
  process.env.NEXT_PUBLIC_GO_API_URL ||
  process.env.GO_API_URL ||
  "http://localhost:8080";

export async function GET(_req: NextRequest) {
  try {
    // Use a dedicated service identity to call Go API results
    const email = process.env.RESULTS_SERVICE_EMAIL || "results@service.local";
    const password = process.env.RESULTS_SERVICE_PASSWORD || "servicepass";

    const reg = await fetch(`${GO_API_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
    let token: string | null = null;
    if (reg.ok) {
      const d = await reg.json();
      token = d?.token || null;
    } else if (reg.status === 409) {
      const login = await fetch(`${GO_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      });
      const d = await login.json();
      token = d?.token || null;
    }
    if (!token)
      return NextResponse.json({ error: "auth failed" }, { status: 502 });

    const res = await fetch(`${GO_API_URL}/api/results`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
