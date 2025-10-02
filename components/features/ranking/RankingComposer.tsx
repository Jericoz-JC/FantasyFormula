"use client";

import { useEffect, useMemo, useState } from "react";
import driversData from "@/lib/data/drivers.json";
import { RankList } from "./RankList";
import { SubmitBar } from "./SubmitBar";
import type { Driver } from "./DriverRow";

interface RankingComposerProps {
  raceId: string;
  lockTime: string;
}

export function RankingComposer({ raceId, lockTime }: RankingComposerProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [saving, setSaving] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    // initialize from seed data (sorted by currentPosition)
    const initial = [...(driversData as any).drivers]
      .sort((a: any, b: any) => a.position - b.position)
      .map((d: any) => ({
        driverId: d.driverId,
        name: d.name,
        abbreviation: d.abbreviation,
        number: d.number,
        team: d.team,
        teamColors: {
          primary: d.teamColors.primary,
          secondary: d.teamColors.secondary,
          name: d.teamColors.name,
        },
      }));
    setDrivers(initial);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      setLocked(now > new Date(lockTime));
    }, 1000);
    return () => clearInterval(t);
  }, [lockTime]);

  const isValid = useMemo(() => drivers.length === 20, [drivers]);

  async function handleSubmit() {
    if (!isValid || locked) return;
    setSaving(true);
    try {
      const payload = {
        raceId,
        rankings: {
          drivers: drivers.map((d, idx) => ({ position: idx + 1, driverId: d.driverId })),
        },
      };
      const res = await fetch("/api/rankings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error("Submit failed", await res.text());
        return;
      }
      alert("Ranking submitted! You can edit until lock time.");
    } finally {
      setSaving(false);
    }
  }

  function handleClear() {
    // Reset to alphabetical by driverId for a predictable reset
    const reset = [...drivers].sort((a, b) => a.driverId.localeCompare(b.driverId));
    setDrivers(reset);
  }

  return (
    <div className="space-y-3">
      <RankList drivers={drivers} onChange={setDrivers} />
      <div className="pb-24 md:pb-6" />
      <SubmitBar isValid={isValid} isLocked={locked} onSubmit={handleSubmit} onClear={handleClear} onSaveDraft={() => {}} />
    </div>
  );
}
