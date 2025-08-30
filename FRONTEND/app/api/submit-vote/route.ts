import { NextRequest, NextResponse } from "next/server";

const GO_API_URL =
  process.env.NEXT_PUBLIC_GO_API_URL ||
  process.env.GO_API_URL ||
  "http://localhost:8080";

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

export async function POST(req: NextRequest) {
  try {
    const { electionId, candidateIndex, cedula, fingerprintCode } =
      await req.json();
    if (
      !electionId ||
      typeof candidateIndex !== "number" ||
      !cedula ||
      !fingerprintCode
    ) {
      return NextResponse.json({ error: "invalid body" }, { status: 400 });
    }

    // derive a demo user from cedula (server-side demo only)
    const email = `${cedula.toLowerCase()}@voter.local`;
    const password = cedula;

    // try register, fallback to login if exists
    let token: string | null = null;
    const reg = await goApi("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (reg.ok) {
      token = reg.data?.token;
    } else if (reg.status === 409) {
      const login = await goApi("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (!login.ok)
        return NextResponse.json({ error: "auth failed" }, { status: 401 });
      token = login.data?.token;
    } else {
      return NextResponse.json({ error: "register failed" }, { status: 500 });
    }

    if (!token)
      return NextResponse.json({ error: "no token" }, { status: 500 });

    // submit vote
    const submit = await fetch(`${GO_API_URL}/api/submitVote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ electionId: String(electionId), candidateIndex }),
      cache: "no-store",
    });
    const submitData = await submit.json().catch(() => ({}));
    if (!submit.ok)
      return NextResponse.json(submitData, { status: submit.status });

    return NextResponse.json({ success: true, tx: submitData.tx });
  } catch (e) {
    console.error("submit-vote route error:", e);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
