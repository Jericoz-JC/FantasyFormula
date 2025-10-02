export default function ProfilePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="text-sm text-muted-foreground">You are not signed in. Authentication UI will be added later.</div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">ELO Rating</div>
          <div className="text-2xl font-bold">—</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">Total Points</div>
          <div className="text-2xl font-bold">—</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-xs text-muted-foreground">Rankings Count</div>
          <div className="text-2xl font-bold">—</div>
        </div>
      </div>
    </div>
  );
}
