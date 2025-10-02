import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleApiError(error: unknown): NextResponse {
  // Zod validation errors
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

  // Custom API errors
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.name,
        message: error.message,
      },
      { status: error.statusCode }
    );
  }

  // Prisma errors
  if (error && typeof error === "object" && "code" in error) {
    const prismaError = error as { code: string; meta?: { target?: string[] } };
    
    if (prismaError.code === "P2002") {
      const target = prismaError.meta?.target?.[0] || "field";
      return NextResponse.json(
        {
          error: "Conflict",
          message: `${target} already exists`,
        },
        { status: 409 }
      );
    }

    if (prismaError.code === "P2025") {
      return NextResponse.json(
        {
          error: "Not found",
          message: "Record not found",
        },
        { status: 404 }
      );
    }
  }

  // Generic errors
  console.error("Unhandled API error:", error);
  
  return NextResponse.json(
    {
      error: "Internal server error",
      message: process.env.NODE_ENV === "development" 
        ? String(error) 
        : "An unexpected error occurred",
    },
    { status: 500 }
  );
}

