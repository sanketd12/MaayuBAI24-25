import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@/db/schema/platform";

export const db = drizzle(process.env.DATABASE_URL || "", {
    schema,
});
