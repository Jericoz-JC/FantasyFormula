import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "You must be logged in" },
        { status: 401 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: {
        friends: {
          include: {
            friend: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true,
                eloRating: true,
                totalPoints: true,
                rankingsCount: true,
              },
            },
          },
        },
      },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "Not found", message: "User not found" },
        { status: 404 }
      );
    }

    // Include current user in the leaderboard
    const friendsData = [
      {
        id: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName,
        avatar: currentUser.avatar,
        eloRating: currentUser.eloRating,
        totalPoints: currentUser.totalPoints,
        rankingsCount: currentUser.rankingsCount,
        isCurrentUser: true,
      },
      ...currentUser.friends.map((f) => ({
        ...f.friend,
        isCurrentUser: false,
      })),
    ];

    // Sort by ELO rating
    const sorted = friendsData.sort((a, b) => b.eloRating - a.eloRating);

    // Add rank
    const leaderboard = sorted.map((user, index) => ({
      rank: index + 1,
      ...user,
    }));

    return NextResponse.json({
      data: {
        leaderboard,
        total: leaderboard.length,
      },
      message: "Friends leaderboard fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching friends leaderboard:", error);
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}

