"use client";

import { useState } from "react";

interface SessionSelectorProps {
  hasSprint?: boolean;
  onChange(session: "grand_prix" | "sprint"): void;
}

export function SessionSelector({ hasSprint, onChange }: SessionSelectorProps) {
  const [session, setSession] = useState<"grand_prix" | "sprint">("grand_prix");

  function handleChange(value: "grand_prix" | "sprint") {
    setSession(value);
    onChange(value);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm ${
          session === "grand_prix" ? "bg-primary text-primary-foreground" : "border border-border bg-background"
        }`}
        onClick={() => handleChange("grand_prix")}
      >
        Grand Prix
      </button>
      <button
        className={`inline-flex items-center rounded-md px-3 py-1.5 text-sm ${
          session === "sprint" ? "bg-primary text-primary-foreground" : "border border-border bg-background"
        } ${!hasSprint ? "opacity-50" : ""}`}
        onClick={() => hasSprint && handleChange("sprint")}
        disabled={!hasSprint}
      >
        Sprint
      </button>
      <div className="ml-auto text-xs text-muted-foreground">
        {session === "grand_prix" ? "Points: 25-18-15-12-10-8-6-4-2-1" : "Sprint Points: 8-7-6-5-4-3-2-1"}
      </div>
    </div>
  );
}
