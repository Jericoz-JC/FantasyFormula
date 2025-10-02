"use client";

import { Menu } from "lucide-react";
import Link from "next/link";

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted/50">
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="font-bold">
            Fantasy Formula
          </Link>
        </div>
        <nav className="hidden items-center gap-4 md:flex">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <Link href="/leaderboard" className="text-sm text-muted-foreground hover:text-foreground">
            Leaderboard
          </Link>
          <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground">
            Profile
          </Link>
        </nav>
      </div>
    </header>
  );
}
