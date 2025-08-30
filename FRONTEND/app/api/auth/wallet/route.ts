import { NextRequest, NextResponse } from "next/server";

// Simple mock: GET returns current mock auth state, POST attempts to authenticate
export async function GET() {
  const mockAddress = "0x123456789abcdef123456789abcdef1234567890";
  const mockEns = "voter.eth";

  return NextResponse.json({
    connected: true,
    sessionAddress: mockAddress,
    walletAddress: mockAddress,
    ensName: mockEns,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { cedula, fingerprintCode } = body;

    // Basic validation - in real backend validate against DB or external service
    if (!cedula || !fingerprintCode) {
      return NextResponse.json(
        { error: "missing id or fingerprint" },
        { status: 400 }
      );
    }

    // For demo purposes, accept any values and return a mock wallet
    const mockAddress = "0x123456789abcdef123456789abcdef1234567890";
    const mockEns = "voter.eth";

    return NextResponse.json({
      connected: true,
      sessionAddress: mockAddress,
      walletAddress: mockAddress,
      ensName: mockEns,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("auth wallet POST error", e);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }
}
