import { RaceCard } from "@/components/features/races/RaceCard";

async function getUpcomingRace() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/races/upcoming`, {
      cache: "no-store",
      // If base URL isn't set, Next.js will resolve relative to the same host
    });
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

export default async function DashboardPage() {
  const nextRace = await getUpcomingRace();

  return (
    <div className="space-y-4">
      <section className="space-y-2">
        <h2 className="text-xl font-bold">Next Race</h2>
        {!nextRace ? (
          <div className="rounded-lg border border-border p-6 text-sm text-muted-foreground">
            No upcoming race found.
          </div>
        ) : (
          <RaceCard
            id={nextRace.id}
            name={nextRace.name}
            location={nextRace.location}
            country={nextRace.country}
            date={nextRace.date}
            round={nextRace.round}
            hasSprint={nextRace.hasSprint}
            lockTime={nextRace.lockTime}
          />
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">ELO Rating</div>
          <div className="text-2xl font-bold">—</div>
          <div className="text-xs text-muted-foreground">Sign in later to track</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">Rankings Count</div>
          <div className="text-2xl font-bold">—</div>
          <div className="text-xs text-muted-foreground">Your total submissions</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">Total Points</div>
          <div className="text-2xl font-bold">—</div>
          <div className="text-xs text-muted-foreground">Calculated after races</div>
        </div>
      </section>
    </div>
  );
}
