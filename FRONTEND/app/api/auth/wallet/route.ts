import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "vc_session";

type Session = {
  address: string;
  ens: string;
  cedula: string;
  fingerprintCode: string;
};

function makeAddressFromCedula(cedula: string) {
  // Tiny deterministic pseudo-address for demo only (not secure)
  const base = Buffer.from(cedula).toString("hex").padEnd(40, "0").slice(0, 40);
  return "0x" + base;
}

export async function GET(req: NextRequest) {
  try {
    const cookie = req.cookies.get(COOKIE_NAME)?.value;
    if (!cookie) {
      return NextResponse.json({ connected: false });
    }
    const session = JSON.parse(cookie) as Partial<Session>;
    return NextResponse.json({
      connected: true,
      sessionAddress: session.address,
      walletAddress: session.address,
      ensName: session.ens,
      cedula: session.cedula,
      fingerprintCode: session.fingerprintCode,
    });
  } catch {
    return NextResponse.json({ connected: false });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const cedula = String(body?.cedula || "").trim();
    const fingerprintCode = String(body?.fingerprintCode || "").trim();

    if (!cedula || !fingerprintCode) {
      return NextResponse.json(
        { error: "missing id or fingerprint" },
        { status: 400 }
      );
    }

    const address = makeAddressFromCedula(cedula);
    const ens = `${cedula}.eth`;

    const res = NextResponse.json({
      connected: true,
      sessionAddress: address,
      walletAddress: address,
      ensName: ens,
    });
    res.cookies.set({
      name: COOKIE_NAME,
      value: JSON.stringify({ address, ens, cedula, fingerprintCode }),
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8h
    });
    return res;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("auth wallet POST error", e);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
