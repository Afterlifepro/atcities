import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL)
  throw new Error("Missing TURSO_DATABASE_URL");

if (!process.env.DATABASE_AUTH_TOKEN) throw new Error("Missing TURSO_AUTH_TOKEN");

export default defineConfig({
  out: "./drizzle",
  schema: "./app/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
