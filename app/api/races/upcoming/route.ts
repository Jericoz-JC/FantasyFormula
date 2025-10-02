import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const now = new Date();

    const nextRace = await prisma.race.findFirst({
      where: {
        date: { gte: now },
        status: "UPCOMING",
      },
      orderBy: { date: "asc" },
      include: {
        rankings: userId
          ? {
              where: { userId },
              select: {
                id: true,
                submittedAt: true,
              },
            }
          : false,
        _count: {
          select: { rankings: true },
        },
      },
    });

    if (!nextRace) {
      return NextResponse.json(
        {
          error: "Not found",
          message: "No upcoming races found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: nextRace,
      message: "Next race fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching upcoming race:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch upcoming race",
      },
      { status: 500 }
    );
  }
}

