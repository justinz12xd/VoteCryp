import { NextResponse } from "next/server";

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
