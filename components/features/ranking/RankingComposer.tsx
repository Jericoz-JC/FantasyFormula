"use client";

import { useEffect, useMemo, useState } from "react";
import driversData from "@/lib/data/drivers.json";
import { RankList } from "./RankList";
import { SubmitBar } from "./SubmitBar";
import type { Driver } from "./DriverRow";

interface RankingComposerProps {
  raceId: string | null;
  lockTime?: string;
  disableLock?: boolean;
}

export function RankingComposer({ raceId, lockTime, disableLock = false }: RankingComposerProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [saving, setSaving] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
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
        currentPosition: d.position,
        points: d.points,
      }));
    setDrivers(initial);
  }, []);

  useEffect(() => {
    if (disableLock) {
      setLocked(false);
      return;
    }
    if (!lockTime) {
      setLocked(false);
      return;
    }
    const t = setInterval(() => {
      const now = new Date();
      setLocked(now > new Date(lockTime));
    }, 1000);
    return () => clearInterval(t);
  }, [lockTime, disableLock]);

  const isValid = useMemo(() => drivers.length === 20, [drivers]);

  async function handleSubmit() {
    if (!isValid || locked || !raceId) return;
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
    const reset = [...drivers].sort((a, b) => (a.currentPosition ?? 99) - (b.currentPosition ?? 99));
    setDrivers(reset);
  }

  return (
    <div className="space-y-3">
      <RankList drivers={drivers} onChange={setDrivers} />
      <div className="pb-24 md:pb-6" />
      <SubmitBar
        isValid={isValid}
        isLocked={locked}
        onSubmit={handleSubmit}
        onClear={handleClear}
        onSaveDraft={() => {}}
      />
    </div>
  );
}
