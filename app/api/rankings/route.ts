import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";
import { rankingSubmissionSchema } from "@/lib/validations/ranking";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "You must be logged in to submit rankings",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { raceId, rankings } = rankingSubmissionSchema.parse(body);

    // Check if race exists and is not locked
    const race = await prisma.race.findUnique({
      where: { id: raceId },
    });

    if (!race) {
      return NextResponse.json(
        {
          error: "Not found",
          message: "Race not found",
        },
        { status: 404 }
      );
    }

    // Check if race is locked (past lock time)
    const now = new Date();
    if (now > race.lockTime) {
      return NextResponse.json(
        {
          error: "Race locked",
          message: "Rankings are locked for this race. The deadline has passed.",
        },
        { status: 400 }
      );
    }

    // Check if race is not upcoming
    if (race.status !== "UPCOMING") {
      return NextResponse.json(
        {
          error: "Invalid race status",
          message: "You can only submit rankings for upcoming races",
        },
        { status: 400 }
      );
    }

    // Check if user already submitted a ranking
    const existingRanking = await prisma.ranking.findUnique({
      where: {
        userId_raceId: {
          userId: session.user.id,
          raceId,
        },
      },
    });

    if (existingRanking) {
      return NextResponse.json(
        {
          error: "Already submitted",
          message: "You have already submitted a ranking for this race. Use PATCH to update.",
        },
        { status: 400 }
      );
    }

    // Create ranking
    const ranking = await prisma.ranking.create({
      data: {
        userId: session.user.id,
        raceId,
        rankings,
      },
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

    // Increment user's rankings count
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        rankingsCount: { increment: 1 },
      },
    });

    return NextResponse.json(
      {
        data: ranking,
        message: "Ranking submitted successfully",
      },
      { status: 201 }
    );
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

    console.error("Error submitting ranking:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to submit ranking",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "You must be logged in to view rankings",
        },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const raceId = searchParams.get("raceId");

    const where: { userId: string; raceId?: string } = {
      userId: session.user.id,
    };

    if (raceId) {
      where.raceId = raceId;
    }

    const rankings = await prisma.ranking.findMany({
      where,
      include: {
        race: {
          select: {
            id: true,
            name: true,
            date: true,
            status: true,
            lockTime: true,
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
    });

    return NextResponse.json({
      data: rankings,
      message: "Rankings fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching rankings:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch rankings",
      },
      { status: 500 }
    );
  }
}

