import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const userId = session?.user?.id;

    const race = await prisma.race.findUnique({
      where: { id },
      include: {
        raceResult: true,
        rankings: userId
          ? {
              where: { userId },
              select: {
                id: true,
                rankings: true,
                eloChange: true,
                score: true,
                pointsBreakdown: true,
                submittedAt: true,
              },
            }
          : false,
        _count: {
          select: { rankings: true },
        },
      },
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

    return NextResponse.json({
      data: race,
      message: "Race fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching race:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch race",
      },
      { status: 500 }
    );
  }
}

