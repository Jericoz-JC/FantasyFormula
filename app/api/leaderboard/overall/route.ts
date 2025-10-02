import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        eloRating: true,
        totalPoints: true,
        rankingsCount: true,
        createdAt: true,
      },
      orderBy: {
        eloRating: "desc",
      },
      take: limit,
      skip: offset,
    });

    // Add rank to each user
    const leaderboard = users.map((user, index) => ({
      rank: offset + index + 1,
      ...user,
    }));

    // Get total count
    const totalCount = await prisma.user.count();

    return NextResponse.json({
      data: {
        leaderboard,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount,
        },
      },
      message: "Overall leaderboard fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching overall leaderboard:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch overall leaderboard",
      },
      { status: 500 }
    );
  }
}

