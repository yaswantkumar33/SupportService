import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../config/env";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});
// you can add the schema here or 
export const db = drizzle(pool, { schema });
// do like this in services 
// const [userExist] = await db
//   .select()
//   .from(users)
//   .where(eq(users.email, input.email));