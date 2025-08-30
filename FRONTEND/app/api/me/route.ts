import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const base = process.env.NEXT_PUBLIC_GO_API_URL || "http://localhost:8080";
  const auth = request.headers.get("authorization") || "";
  try {
    const res = await fetch(`${base}/api/me`, {
      headers: { Authorization: auth },
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json({ error: "proxy failed" }, { status: 502 });
  }
}
