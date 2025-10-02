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
}

interface DriverRowProps {
  index: number;
  driver: Driver;
  dragHandle?: React.ReactNode;
}

export function DriverRow({ index, driver, dragHandle }: DriverRowProps) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2">
      <div className="flex items-center gap-3">
        <PositionChip position={index + 1} />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold leading-tight">{driver.name}</span>
            <span className="text-xs text-muted-foreground">{driver.abbreviation} · #{driver.number}</span>
          </div>
          <TeamBadge
            name={driver.team}
            primary={driver.teamColors.primary}
            secondary={driver.teamColors.secondary}
          />
        </div>
      </div>
      <div className="ml-2">{dragHandle}</div>
    </div>
  );
}
