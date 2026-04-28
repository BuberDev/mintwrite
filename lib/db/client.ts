import { db as drizzle } from "./drizzle";
import { users } from "./schema";
import { eq } from "drizzle-orm";

/**
 * LEGACY DATABASE CLIENT WRAPPER
 * 
 * This file is maintained for backward compatibility during the Drizzle ORM migration.
 * It uses the same unified connection pool as the new Drizzle client.
 * 
 * New code should import 'db' from '@/lib/db/drizzle' and use Drizzle's type-safe API.
 */

// Re-export drizzle as db for compatibility where only 'db' is expected
export const db = drizzle as any;

// Helper to handle simple raw SQL queries (Legacy compatibility)
export async function query<T>(text: string, params?: any[]) {
  const start = Date.now();
  
  // Use drizzle.execute to run raw SQL on the same pool
  const res = await drizzle.execute(text as any);
  
  const duration = Date.now() - start;
  console.log('[Legacy Query] Executed', { text, duration, rows: res.rowCount });
  return res;
}

// User helpers (Legacy compatibility)
export async function getOrCreateUser(userId: string, email: string) {
  const existingUser = await drizzle.query.users.findFirst({
    where: eq(users.id, userId),
  });
  
  if (existingUser) {
    const [updatedUser] = await drizzle.update(users)
      .set({ 
        email, 
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  }

  const [newUser] = await drizzle.insert(users)
    .values({
      id: userId,
      email,
      emailNormalized: email.toLowerCase(),
      displayName: email.split("@")[0],
    })
    .returning();
    
  return newUser;
}

// ensureAppTables is no longer needed with Drizzle Kit but we keep it empty to not break imports
export async function ensureAppTables() {
  return Promise.resolve();
}
