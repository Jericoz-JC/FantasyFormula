"use client";

import { useEffect, useState } from "react";
import racesData from "@/lib/data/races.json";
import { RankingComposer } from "@/components/features/ranking/RankingComposer";
import { SessionSelector } from "@/components/features/ranking/SessionSelector";

type RaceOption = {
  id: string;
  name: string;
  location: string;
  country: string;
  date: string;
  round: number;
  hasSprint?: boolean;
  lockTime?: string;
};

export default function HomePage() {
  const [selected, setSelected] = useState<RaceOption | null>(null);
  const [options, setOptions] = useState<RaceOption[]>([]);
  const [session, setSession] = useState<"grand_prix" | "sprint">("grand_prix");

  useEffect(() => {
    const opts = (racesData as any).races.map((r: any) => ({
      id: `${r.name}-${r.round}`,
      name: r.name,
      location: r.location,
      country: r.country,
      date: r.date,
      round: r.round,
      hasSprint: r.hasSprint,
      lockTime: r.date,
    }));
    setOptions(opts);
    setSelected(opts[0] ?? null);
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl px-4">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col gap-4 pt-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Rank Drivers</h1>
          <p className="text-sm text-muted-foreground">Pick a session and drag drivers into your finishing order. Mobile-first and fun.</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <label className="mb-2 block text-xs font-medium text-muted-foreground">Select session</label>
          <select
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            value={selected?.id ?? ""}
            onChange={(e) => setSelected(options.find((o) => o.id === e.target.value) ?? null)}
          >
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                Round {o.round} • {o.name} {o.hasSprint ? "(Sprint)" : ""}
              </option>
            ))}
          </select>
          {selected ? (
            <div className="mt-2 text-xs text-muted-foreground">
              {selected.location} • {new Date(selected.date).toLocaleString()} • {selected.country}
            </div>
          ) : null}
          <div className="mt-3">
            <SessionSelector hasSprint={selected?.hasSprint} onChange={setSession} />
          </div>
        </div>

        <RankingComposer raceId={null} disableLock />
      </div>
    </div>
  );
}

