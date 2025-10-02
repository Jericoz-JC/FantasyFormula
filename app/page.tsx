import Link from "next/link";

async function getUpcomingRace() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/races/upcoming`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as {
      id: string;
      name: string;
      location: string;
      country: string;
      date: string;
      season: number;
      round: number;
      status: string;
      hasSprint: boolean;
      lockTime: string;
    } | null;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const nextRace = await getUpcomingRace();

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-7xl flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-racing-red">Fantasy Formula</h1>
        <p className="text-sm text-muted-foreground">Rank all 20 drivers before lock. Earn ELO based on accuracy.</p>
      </div>

      {nextRace ? (
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-5 text-left shadow-sm">
          <div className="text-xs text-muted-foreground">Round {nextRace.round} • {nextRace.country}</div>
          <h2 className="mt-1 text-xl font-bold">{nextRace.name}</h2>
          <div className="text-sm text-muted-foreground">{nextRace.location} • {new Date(nextRace.date).toLocaleString()}</div>
          {nextRace.hasSprint ? (
            <div className="mt-2 inline-flex items-center rounded-md bg-racing-red/10 px-2 py-1 text-xs font-medium text-racing-red">
              Sprint Weekend
            </div>
          ) : null}

          <div className="mt-4 flex items-center gap-2">
            <Link
              href={`/races/${nextRace.id}`}
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Rank Drivers
            </Link>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Lock: {new Date(nextRace.lockTime).toLocaleString()}</div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">No upcoming race found. See the leaderboard.</div>
      )}

      <div className="mt-2 flex w-full max-w-md items-center justify-center gap-3 text-sm">
        <Link href="/dashboard" className="rounded-md border border-border px-3 py-2 hover:bg-muted/50">Dashboard</Link>
        <Link href="/leaderboard" className="rounded-md border border-border px-3 py-2 hover:bg-muted/50">Leaderboard</Link>
        <Link href="/profile" className="rounded-md border border-border px-3 py-2 hover:bg-muted/50">Profile</Link>
      </div>
    </div>
  );
}

