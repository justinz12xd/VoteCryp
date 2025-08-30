import { NextRequest, NextResponse } from "next/server";

const BC_URL =
  process.env.NEXT_PUBLIC_BLOCKCHAIN_SVC_URL ||
  process.env.BLOCKCHAIN_SVC_URL ||
  "http://localhost:4002";

export async function GET() {
  try {
    const res = await fetch(`${BC_URL}/activeElections`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${BC_URL}/createElection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
