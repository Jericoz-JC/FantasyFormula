"use client";

import { useEffect, useState } from "react";
import racesData from "@/lib/data/races.json";
import { RankingComposer } from "@/components/features/ranking/RankingComposer";
import { SessionSelector } from "@/components/features/ranking/SessionSelector";
import { Trophy } from "lucide-react";

type RaceOption = {
  id: string;
  name: string;
  location: string;
  country: string;
  date: string;
  round: number;
  hasSprint?: boolean;
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
    }));
    setOptions(opts);
    setSelected(opts[0] ?? null);
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl px-4">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col gap-6 pt-6">
        <div className="flex items-center gap-3">
          <Trophy className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Fantasy Formula</h1>
            <p className="text-sm text-muted-foreground">Rank drivers, earn ELO, compete globally</p>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-border bg-card/50 p-5 shadow-lg backdrop-blur">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Session</label>
            <select
              className="w-full rounded-md border border-border bg-background/80 px-3 py-2.5 text-sm shadow-sm focus:ring-2 focus:ring-primary"
              value={selected?.id ?? ""}
              onChange={(e) => setSelected(options.find((o) => o.id === e.target.value) ?? null)}
            >
              {options.map((o) => (
                <option key={o.id} value={o.id}>
                  Round {o.round} • {o.name}
                </option>
              ))}
            </select>
            {selected ? (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{selected.location} • {selected.country}</span>
                <span>{new Date(selected.date).toLocaleDateString()}</span>
              </div>
            ) : null}
          </div>

          {selected ? (
            <SessionSelector hasSprint={selected.hasSprint} onChange={setSession} />
          ) : null}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Rank All 20 Drivers</h2>
            <span className="text-xs text-muted-foreground">{session === "sprint" ? "Sprint" : "Grand Prix"}</span>
          </div>
          <RankingComposer raceId={null} disableLock />
        </div>
      </div>
    </div>
  );
}
