"use client";

import { PositionChip } from "./PositionChip";
import { TeamBadge } from "./TeamBadge";

export interface Driver {
  driverId: string;
  name: string;
  abbreviation: string;
  number: number;
  team: string;
  teamColors: { primary: string; secondary?: string; name: string };
  currentPosition?: number;
  points?: number;
}

interface DriverRowProps {
  index: number;
  driver: Driver;
  dragHandle?: React.ReactNode;
}

export function DriverRow({ index, driver, dragHandle }: DriverRowProps) {
  return (
    <div
      className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2"
      style={{ borderLeft: `3px solid ${driver.teamColors.primary}` }}
    >
      <div className="flex items-center gap-3">
        <PositionChip position={index + 1} />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold leading-tight">{driver.name}</span>
            <span className="text-xs text-muted-foreground">{driver.abbreviation} · #{driver.number}</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <TeamBadge
              name={driver.team}
              primary={driver.teamColors.primary}
              secondary={driver.teamColors.secondary}
            />
            {driver.currentPosition != null && (
              <span className="text-xs text-muted-foreground">P{driver.currentPosition}</span>
            )}
            {driver.points != null && (
              <span className="text-xs text-muted-foreground">{driver.points} pts</span>
            )}
          </div>
        </div>
      </div>
      <div className="ml-2">{dragHandle}</div>
    </div>
  );
}
