import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .default("3000")
    .transform((val) => parseInt(val, 10)),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z
    .string()
    .url("Database Url Must be a valid postgresql database string"),
});

export const env = envSchema.parse(process.env);
