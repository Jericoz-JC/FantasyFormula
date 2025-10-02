import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const addFriendSchema = z.object({
  friendCode: z.string().length(5, "Friend code must be 5 characters"),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "You must be logged in" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { friendCode } = addFriendSchema.parse(body);

    // Get current user from database
    const currentUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "Not found", message: "User not found in database" },
        { status: 404 }
      );
    }

    // Find friend by code
    const friend = await prisma.user.findUnique({
      where: { friendCode: friendCode.toUpperCase() },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        eloRating: true,
        friendCode: true,
      },
    });

    if (!friend) {
      return NextResponse.json(
        { error: "Not found", message: "Friend code not found" },
        { status: 404 }
      );
    }

    // Can't add yourself
    if (friend.id === currentUser.id) {
      return NextResponse.json(
        { error: "Invalid", message: "You cannot add yourself as a friend" },
        { status: 400 }
      );
    }

    // Check if already friends
    const existingFriendship = await prisma.friendship.findUnique({
      where: {
        userId_friendId: {
          userId: currentUser.id,
          friendId: friend.id,
        },
      },
    });

    if (existingFriendship) {
      return NextResponse.json(
        { error: "Conflict", message: "Already friends with this user" },
        { status: 409 }
      );
    }

    // Create bidirectional friendship
    await prisma.$transaction([
      prisma.friendship.create({
        data: {
          userId: currentUser.id,
          friendId: friend.id,
        },
      }),
      prisma.friendship.create({
        data: {
          userId: friend.id,
          friendId: currentUser.id,
        },
      }),
    ]);

    return NextResponse.json(
      {
        data: friend,
        message: `${friend.displayName || friend.username} added as friend!`,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: error.issues[0].message,
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error("Error adding friend:", error);
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to add friend" },
      { status: 500 }
    );
  }
}

