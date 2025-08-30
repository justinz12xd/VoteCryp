import { NextRequest, NextResponse } from "next/server";

const GO_API_URL =
  process.env.NEXT_PUBLIC_GO_API_URL ||
  process.env.GO_API_URL ||
  "http://localhost:8080";
const SERVICE_EMAIL =
  process.env.RESULTS_SERVICE_EMAIL || "results@service.local";
const SERVICE_PASSWORD = process.env.RESULTS_SERVICE_PASSWORD || "servicepass";

async function goApi(path: string, init?: RequestInit) {
  const res = await fetch(`${GO_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

export async function GET(_req: NextRequest) {
  try {
    // Try register, fallback to login if exists
    let token: string | null = null;
    const reg = await goApi("/api/register", {
      method: "POST",
      body: JSON.stringify({
        email: SERVICE_EMAIL,
        password: SERVICE_PASSWORD,
      }),
    });
    if (reg.ok) {
      token = reg.data?.token;
    } else if (reg.status === 409) {
      const login = await goApi("/api/login", {
        method: "POST",
        body: JSON.stringify({
          email: SERVICE_EMAIL,
          password: SERVICE_PASSWORD,
        }),
      });
      if (!login.ok)
        return NextResponse.json({ error: "auth failed" }, { status: 401 });
      token = login.data?.token;
    } else {
      return NextResponse.json({ error: "register failed" }, { status: 500 });
    }

    if (!token)
      return NextResponse.json({ error: "no token" }, { status: 500 });

    const res = await fetch(`${GO_API_URL}/api/results`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("results route error:", e);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
