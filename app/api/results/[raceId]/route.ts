import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { raceResultSchema } from "@/lib/validations/ranking";
import { calculateEloChange, calculateNewElo } from "@/lib/elo/calculateElo";
import { ZodError } from "zod";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ raceId: string }> }
) {
  try {
    const { raceId } = await params;
    
    // Admin authentication check
    const adminKey = request.headers.get("x-admin-key");
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Admin access required",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = raceResultSchema.parse({ raceId, ...body });

    // Check if race exists
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

    // Use Prisma transaction for atomic operations
    const result = await prisma.$transaction(async (tx) => {
      // Create or update race result
      const raceResult = await tx.raceResult.upsert({
        where: { raceId },
        create: {
          raceId,
          results: validatedData.results,
        },
        update: {
          results: validatedData.results,
        },
      });

      // Get all rankings for this race
      const rankings = await tx.ranking.findMany({
        where: { raceId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              eloRating: true,
              rankingsCount: true,
              totalPoints: true,
            },
          },
        },
      });

      // Calculate ELO for each ranking
      const eloUpdates = [];

      for (const ranking of rankings) {
        // Extract user rankings
        const userRankings = (ranking.rankings as { drivers: Array<{ position: number; driverId: string }> }).drivers;
        
        // Extract actual results
        const actualResults = validatedData.results.finalPositions.map((r) => ({
          position: r.position,
          driverId: r.driverId,
        }));

        // Calculate ELO change
        const eloCalc = calculateEloChange(
          userRankings,
          actualResults,
          ranking.user.eloRating,
          ranking.user.rankingsCount
        );

        // Calculate new ELO
        const newElo = calculateNewElo(ranking.user.eloRating, eloCalc.eloChange);

        // Calculate score (for leaderboard display)
        const score = Math.round(eloCalc.accuracy.accuracy);

        // Update ranking with ELO change and score
        await tx.ranking.update({
          where: { id: ranking.id },
          data: {
            eloChange: eloCalc.eloChange,
            score,
            pointsBreakdown: {
              accuracy: eloCalc.accuracy.accuracy,
              correlation: eloCalc.accuracy.correlation,
              exactPodium: eloCalc.accuracy.exactPodium,
              correctWinner: eloCalc.accuracy.correctWinner,
              topFiveCorrect: eloCalc.accuracy.topFiveCorrect,
              breakdown: eloCalc.breakdown,
            },
          },
        });

        // Update user ELO and total points
        await tx.user.update({
          where: { id: ranking.user.id },
          data: {
            eloRating: newElo,
            totalPoints: { increment: score },
          },
        });

        eloUpdates.push({
          userId: ranking.user.id,
          username: ranking.user.username,
          oldElo: ranking.user.eloRating,
          newElo,
          eloChange: eloCalc.eloChange,
          score,
        });
      }

      // Update race status to COMPLETED
      await tx.race.update({
        where: { id: raceId },
        data: { status: "COMPLETED" },
      });

      return { raceResult, eloUpdates };
    });

    return NextResponse.json(
      {
        data: result,
        message: `Race results published. ${result.eloUpdates.length} rankings processed.`,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          message: error.issues[0].message,
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error("Error submitting race results:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to submit race results",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ raceId: string }> }
) {
  try {
    const { raceId } = await params;

    const raceResult = await prisma.raceResult.findUnique({
      where: { raceId },
      include: {
        race: {
          select: {
            id: true,
            name: true,
            date: true,
            status: true,
          },
        },
      },
    });

    if (!raceResult) {
      return NextResponse.json(
        {
          error: "Not found",
          message: "Race results not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: raceResult,
      message: "Race results fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching race results:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch race results",
      },
      { status: 500 }
    );
  }
}

