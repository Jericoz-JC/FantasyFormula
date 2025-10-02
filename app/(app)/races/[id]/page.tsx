import { RankingComposer } from "@/components/features/ranking/RankingComposer";
import { prisma } from "@/lib/db/prisma";

export default async function RacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const race = await prisma.race.findUnique({ where: { id } });

  if (!race) {
    return (
      <div className="rounded-lg border border-border p-6 text-sm text-muted-foreground">Race not found.</div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="rounded-lg border border-border bg-card p-4">
        <div className="text-xs text-muted-foreground">Round {race.round} • {race.country}</div>
        <h1 className="text-2xl font-bold">{race.name}</h1>
        <div className="text-sm text-muted-foreground">{race.location} • {race.date.toLocaleString()}</div>
        {race.hasSprint ? (
          <div className="mt-2 inline-flex items-center rounded-md bg-racing-red/10 px-2 py-1 text-xs font-medium text-racing-red">
            Sprint Weekend
          </div>
        ) : null}
      </header>

      <section>
        <RankingComposer raceId={race.id} lockTime={race.lockTime.toISOString()} />
      </section>
    </div>
  );
}
