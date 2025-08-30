import { NextResponse } from "next/server";

const BC_URL =
  process.env.NEXT_PUBLIC_BLOCKCHAIN_SVC_URL ||
  process.env.BLOCKCHAIN_SVC_URL ||
  "http://localhost:4002";

export async function GET() {
  try {
    const idsRes = await fetch(`${BC_URL}/activeElections`, { cache: "no-store" });
    if (!idsRes.ok) {
      const msg = await idsRes.text();
      return NextResponse.json({ error: `activeElections failed: ${msg}` }, { status: 502 });
    }
    const idsData = await idsRes.json();
    let ids: number[] = idsData?.ids || [];

    // Dev convenience: if no active elections, create a quick one
  if (!ids || ids.length === 0) {
      const title = "Demo Election";
      const options = ["Alice", "Bob"];
      const qs = new URLSearchParams({
        title,
        options: options.join(","),
        durationHours: String(2),
        enableFHE: String(false),
      }).toString();
      try {
        await fetch(`${BC_URL}/createElectionQuick?${qs}`, { cache: "no-store" });
      } catch {}
      const retry = await fetch(`${BC_URL}/activeElections`, { cache: "no-store" });
      if (retry.ok) {
        const d = await retry.json();
        ids = d?.ids || [];
      }
    }

    const elections = await Promise.all(
      ids.map(async (id: number) => {
        const res = await fetch(`${BC_URL}/contractResults?electionId=${id}`, { cache: "no-store" });
        if (!res.ok) return null;
        const data = await res.json();
        const optionNames: string[] = data.optionNames || [];
        const voteCounts: number[] = data.voteCounts || [];
        const totalVotes: number = Number(data.totalVotes || 0);
        const statusCode: number = Number(data.status || 0);
        let status: "active" | "closed" | "finalized" = "finalized";
        if (statusCode === 0) status = "active";
        else if (statusCode === 1) status = "closed";
        const candidates = optionNames.map((name, i) => {
          const votes = Number(voteCounts[i] || 0);
          let percentage = 0;
          if (totalVotes > 0) {
            percentage = Math.round((votes * 100) / totalVotes);
          }
          return { name, votes, percentage, encryptedVotes: "" };
        });
        return {
          id,
          title: data.title || `Election #${id}`,
          description: data.description || "",
          status,
          startDate: "",
          endDate: "",
          totalVotes,
          liskTxHash: "",
          candidates,
        };
      })
    );

    const list = elections.filter(Boolean);
    return NextResponse.json(list, { status: 200 });
  } catch (e) {
  // eslint-disable-next-line no-console
  console.error("/api/elections error", e);
  return NextResponse.json({ error: "failed to fetch elections" }, { status: 500 });
  }
}
