import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const season = searchParams.get("season");
    const status = searchParams.get("status");
    
    const session = await auth();
    const userId = session?.user?.id;

    const where: {
      season?: number;
      status?: "UPCOMING" | "IN_PROGRESS" | "COMPLETED";
    } = {};

    if (season) {
      where.season = parseInt(season);
    }

    if (status) {
      where.status = status as "UPCOMING" | "IN_PROGRESS" | "COMPLETED";
    }

    const races = await prisma.race.findMany({
      where,
      orderBy: [{ season: "desc" }, { round: "asc" }],
      include: {
        _count: {
          select: { rankings: true },
        },
        rankings: userId
          ? {
              where: { userId },
              select: {
                id: true,
                submittedAt: true,
                eloChange: true,
                score: true,
              },
            }
          : false,
      },
    });

    return NextResponse.json({
      data: races,
      message: "Races fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching races:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch races",
      },
      { status: 500 }
    );
  }
}

