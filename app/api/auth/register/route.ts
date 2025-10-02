import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { registerSchema } from "@/lib/validations/auth";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const { email, username, password } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "User already exists",
          message: existingUser.email === email
            ? "Email already registered"
            : "Username already taken",
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        eloRating: 1200, // Starting ELO
        totalPoints: 0,
        rankingsCount: 0,
      },
      select: {
        id: true,
        email: true,
        username: true,
        eloRating: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        data: user,
        message: "User registered successfully",
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

    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to register user",
      },
      { status: 500 }
    );
  }
}

