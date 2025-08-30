import { NextResponse } from "next/server";

export async function GET() {
  // mirror the mock in /api/wallet/route.ts for compatibility
  const mockAddress = "0x123456789abcdef123456789abcdef1234567890";
  const mockEns = "voter.eth";

  return NextResponse.json({
    connected: true,
    walletAddress: mockAddress,
    ensName: mockEns,
  });
}
