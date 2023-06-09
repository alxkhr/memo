import { Pool } from "pg";
import dotenv from 'dotenv';
dotenv.config();

export const pgPool = new Pool({
  user: process.env.PG_U || "memo",
  host: process.env.PG_H || "localhost",
  database: process.env.PG_D || "memo",
  password: process.env.PG_P || "test",
  port: process.env.PG_PO ? parseInt(process.env.PG_PO) : 5432,
});
