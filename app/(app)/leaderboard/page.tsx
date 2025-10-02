async function getLeaderboard() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/leaderboard/overall`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data.leaderboard as Array<{
      rank: number;
      id: string;
      username: string;
      eloRating: number;
      totalPoints: number;
      rankingsCount: number;
      createdAt: string;
    }>;
  } catch {
    return [];
  }
}

export default async function LeaderboardPage() {
  const data = await getLeaderboard();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Leaderboard</h1>
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Rank</th>
              <th className="px-3 py-2 text-left font-medium">User</th>
              <th className="px-3 py-2 text-left font-medium">ELO</th>
              <th className="px-3 py-2 text-left font-medium">Points</th>
              <th className="px-3 py-2 text-left font-medium">Submissions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {data.map((u) => (
              <tr key={u.id}>
                <td className="px-3 py-2">{u.rank}</td>
                <td className="px-3 py-2">{u.username}</td>
                <td className="px-3 py-2">{u.eloRating}</td>
                <td className="px-3 py-2">{u.totalPoints}</td>
                <td className="px-3 py-2">{u.rankingsCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
