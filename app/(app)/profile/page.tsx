import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";
import { GoogleSignIn } from "@/components/auth/GoogleSignIn";
import { Copy, LogOut } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-md space-y-6 py-12">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome to Fantasy Formula</h1>
          <p className="text-sm text-muted-foreground">Sign in to start ranking drivers and compete globally</p>
        </div>
        <div className="rounded-lg border border-border bg-card/50 p-6 backdrop-blur">
          <GoogleSignIn />
        </div>
      </div>
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    select: {
      id: true,
      displayName: true,
      username: true,
      email: true,
      avatar: true,
      friendCode: true,
      eloRating: true,
      totalPoints: true,
      rankingsCount: true,
    },
  });

  if (!dbUser) {
    return <div className="text-center text-muted-foreground">Error loading profile</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile</h1>
        <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>

      <div className="rounded-lg border border-border bg-card/80 p-6 backdrop-blur">
        <div className="flex items-center gap-4">
          {dbUser.avatar && (
            <img
              src={dbUser.avatar}
              alt="Profile"
              className="h-16 w-16 rounded-full border-2 border-primary"
            />
          )}
          <div className="flex-1">
            <div className="text-xl font-bold">{dbUser.displayName || dbUser.username}</div>
            <div className="text-sm text-muted-foreground">{dbUser.email}</div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Your Friend Code
            </div>
            <button
              className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20"
              onClick={() => {
                navigator.clipboard.writeText(dbUser.friendCode);
                alert("Friend code copied!");
              }}
            >
              <Copy className="h-3 w-3" />
              Copy
            </button>
          </div>
          <div className="font-mono text-3xl font-bold tracking-widest text-foreground">
            {dbUser.friendCode}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Share this code with friends so they can add you to their leaderboard
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">ELO Rating</div>
          <div className="text-3xl font-bold text-primary">{dbUser.eloRating}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">Total Points</div>
          <div className="text-3xl font-bold text-accent">{dbUser.totalPoints}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">Rankings Submitted</div>
          <div className="text-3xl font-bold">{dbUser.rankingsCount}</div>
        </div>
      </div>
    </div>
  );
}
