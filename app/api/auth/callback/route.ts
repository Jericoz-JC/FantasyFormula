import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { ensureUniqueFriendCode } from "@/lib/utils/friendCode";

/**
 * Auth callback handler for Supabase OAuth
 * Creates user in our database after successful Google sign-in
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    
    // Exchange code for session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error("Error exchanging code for session:", exchangeError);
      return NextResponse.redirect(`${origin}/auth/error?error=${exchangeError.message}`);
    }

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Error getting user:", userError);
      return NextResponse.redirect(`${origin}/auth/error`);
    }

    try {
      // Check if user already exists in our database
      let dbUser = await prisma.user.findUnique({
        where: { supabaseId: user.id },
      });

      // Create user if doesn't exist
      if (!dbUser) {
        const friendCode = await ensureUniqueFriendCode(prisma);
        
        dbUser = await prisma.user.create({
          data: {
            supabaseId: user.id,
            email: user.email!,
            displayName: user.user_metadata?.full_name || user.user_metadata?.name || null,
            avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
            username: user.email?.split("@")[0] || null, // Default username from email
            friendCode,
            password: null, // OAuth users don't have passwords
          },
        });

        console.log("Created new user:", dbUser.id);
      }

      // Redirect to dashboard after successful authentication
      return NextResponse.redirect(`${origin}/dashboard`);
    } catch (error) {
      console.error("Error creating/finding user:", error);
      return NextResponse.redirect(`${origin}/auth/error?error=database_error`);
    }
  }

  // If no code, redirect to home
  return NextResponse.redirect(`${origin}/`);
}

