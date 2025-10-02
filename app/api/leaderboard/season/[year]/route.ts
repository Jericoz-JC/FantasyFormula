import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ year: string }> }
) {
  try {
    const { year } = await params;
    const season = parseInt(year);
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Get all users with their rankings for this season
    const usersWithStats = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        eloRating: true,
        rankings: {
          where: {
            race: {
              season,
            },
          },
          select: {
            eloChange: true,
            score: true,
          },
        },
      },
    });

    // Calculate season-specific stats
    const leaderboardData = usersWithStats
      .map((user) => {
        const seasonRankings = user.rankings;
        const seasonPoints = seasonRankings.reduce(
          (sum, r) => sum + (r.score || 0),
          0
        );
        const seasonEloGain = seasonRankings.reduce(
          (sum, r) => sum + (r.eloChange || 0),
          0
        );

        return {
          id: user.id,
          username: user.username,
          eloRating: user.eloRating,
          seasonPoints,
          seasonEloGain,
          seasonRankingsCount: seasonRankings.length,
          averageAccuracy:
            seasonRankings.length > 0
              ? Math.round(seasonPoints / seasonRankings.length)
              : 0,
        };
      })
      .filter((user) => user.seasonRankingsCount > 0) // Only users who participated
      .sort((a, b) => b.seasonPoints - a.seasonPoints); // Sort by season points

    // Paginate
    const paginatedLeaderboard = leaderboardData
      .slice(offset, offset + limit)
      .map((user, index) => ({
        rank: offset + index + 1,
        ...user,
      }));

    return NextResponse.json({
      data: {
        season,
        leaderboard: paginatedLeaderboard,
        pagination: {
          total: leaderboardData.length,
          limit,
          offset,
          hasMore: offset + limit < leaderboardData.length,
        },
      },
      message: `Season ${season} leaderboard fetched successfully`,
    });
  } catch (error) {
    console.error("Error fetching season leaderboard:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch season leaderboard",
      },
      { status: 500 }
    );
  }
}

