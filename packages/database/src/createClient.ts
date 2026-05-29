import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { neon } from "@neondatabase/serverless";

export function createPrismaClient(databaseUrl: string): PrismaClient {
  const adapter = new PrismaNeon(neon(databaseUrl));
  return new PrismaClient({ adapter });
}
