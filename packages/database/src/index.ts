import type { PrismaClient } from "@prisma/client";
import { createPrismaClient } from "./createClient";

declare global {
  var client: PrismaClient | undefined;
}

let prisma: PrismaClient | null = null;

function ensureClient(): PrismaClient {
  if (!prisma) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL is required. Set it in .env or call initDatabase().");
    }
    prisma = createPrismaClient(url);
    if (process.env.NODE_ENV !== "production") {
      globalThis.client = prisma;
    }
  }
  return prisma;
}

/** Re-initialize Prisma (Cloudflare Worker bindings). */
export function initDatabase(databaseUrl: string): void {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required");
  }
  prisma = createPrismaClient(databaseUrl);
  if (process.env.NODE_ENV !== "production") {
    globalThis.client = prisma;
  }
}

/** Prisma client (lazy-init from DATABASE_URL). */
export const client: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(ensureClient() as object, prop, receiver);
  },
});
