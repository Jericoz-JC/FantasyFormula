import Link from "next/link";

interface RaceCardProps {
  id: string;
  name: string;
  location: string;
  country: string;
  date: string;
  round: number;
  hasSprint?: boolean;
  lockTime: string;
}

export function RaceCard({ id, name, location, country, date, round, hasSprint, lockTime }: RaceCardProps) {
  const d = new Date(date);
  const lock = new Date(lockTime);
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">Round {round} • {country}</div>
          <h3 className="text-lg font-bold">{name}</h3>
          <div className="text-sm text-muted-foreground">{location} • {d.toLocaleString()}</div>
          {hasSprint ? (
            <span className="mt-2 inline-block rounded-md bg-racing-red/10 px-2 py-1 text-xs font-medium text-racing-red">Sprint Weekend</span>
          ) : null}
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <div>Lock: {lock.toLocaleString()}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Link href={`/races/${id}`} className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          Rank Drivers
        </Link>
        <Link href={`/races/${id}`} className="text-sm text-muted-foreground hover:text-foreground">View details</Link>
      </div>
    </div>
  );
}
