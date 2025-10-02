import { PrismaClient } from "@prisma/client";

/**
 * Generate a random 5-character friend code
 * Uses easy-to-read characters (avoids confusing 0/O, 1/I, etc.)
 */
export function generateFriendCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 32 chars (no 0,1,I,O)
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Generate a unique friend code by checking the database
 * Retries until a unique code is found
 */
export async function ensureUniqueFriendCode(
  prisma: PrismaClient
): Promise<string> {
  let code = generateFriendCode();
  let exists = await prisma.user.findUnique({ where: { friendCode: code } });

  // Keep generating until we find a unique code
  while (exists) {
    code = generateFriendCode();
    exists = await prisma.user.findUnique({ where: { friendCode: code } });
  }

  return code;
}

