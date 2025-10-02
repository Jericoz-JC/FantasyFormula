import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { rankingSubmissionSchema } from "@/lib/validations/ranking";
import { ZodError } from "zod";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "You must be logged in to update rankings",
        },
        { status: 401 }
      );
    }

    // Get existing ranking
    const existingRanking = await prisma.ranking.findUnique({
      where: { id },
      include: { race: true },
    });

    if (!existingRanking) {
      return NextResponse.json(
        {
          error: "Not found",
          message: "Ranking not found",
        },
        { status: 404 }
      );
    }

    // Check ownership
    if (existingRanking.userId !== session.user.id) {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "You can only update your own rankings",
        },
        { status: 403 }
      );
    }

    // Check if race is locked
    const now = new Date();
    if (now > existingRanking.race.lockTime) {
      return NextResponse.json(
        {
          error: "Race locked",
          message: "Rankings are locked for this race. The deadline has passed.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { rankings } = rankingSubmissionSchema.parse({
      raceId: existingRanking.raceId,
      rankings: body.rankings,
    });

    // Update ranking
    const updatedRanking = await prisma.ranking.update({
      where: { id },
      data: { rankings },
      include: {
        race: {
          select: {
            name: true,
            date: true,
            lockTime: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: updatedRanking,
      message: "Ranking updated successfully",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: error.errors[0].message,
          details: error.errors,
        },
        { status: 400 }
      );
    }

    console.error("Error updating ranking:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to update ranking",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    const ranking = await prisma.ranking.findUnique({
      where: { id },
      include: {
        race: true,
        user: {
          select: {
            id: true,
            username: true,
            eloRating: true,
          },
        },
      },
    });

    if (!ranking) {
      return NextResponse.json(
        {
          error: "Not found",
          message: "Ranking not found",
        },
        { status: 404 }
      );
    }

    // Users can only view their own rankings before race is completed
    if (
      ranking.race.status !== "COMPLETED" &&
      ranking.userId !== session?.user?.id
    ) {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: "You can only view your own rankings before the race is completed",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      data: ranking,
      message: "Ranking fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching ranking:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch ranking",
      },
      { status: 500 }
    );
  }
}

