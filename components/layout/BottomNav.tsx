"use client";

import Link from "next/link";
import { Home, Trophy, User } from "lucide-react";

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="mx-auto grid max-w-7xl grid-cols-3 py-2">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 py-1 text-xs text-muted-foreground">
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link href="/leaderboard" className="flex flex-col items-center gap-1 py-1 text-xs text-muted-foreground">
          <Trophy className="h-5 w-5" />
          <span>Leaderboard</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1 py-1 text-xs text-muted-foreground">
          <User className="h-5 w-5" />
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
}
