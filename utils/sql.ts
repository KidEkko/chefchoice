import { neon } from "@neondatabase/serverless";

// TODO: put this in a better spot that is accessible by server components and endpoints
export const sql = neon(`${process.env.DATABASE_URL}`);