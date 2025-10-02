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
                friendCode: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
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

    const friendsList = currentUser.friends.map((f) => f.friend);

    return NextResponse.json({
      data: friendsList,
      message: "Friends fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to fetch friends" },
      { status: 500 }
    );
  }
}

