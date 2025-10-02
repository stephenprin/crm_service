import { Pool } from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL");
});

async function isSeeded(): Promise<boolean> {
  try {
    const res = await pool.query(
      "SELECT to_regclass('public.customers') AS exists;"
    );
    return !!res.rows[0].exists;
  } catch (err) {
    console.error("Error checking if database is seeded:", err);
    return false;
  }
}

export async function seedDatabase(): Promise<void> {
  try {
    const seeded = await isSeeded();
    if (seeded) {
      console.log("Database already seeded. Skipping seed.");
      return;
    }

    const initSQL = fs.readFileSync(path.join(__dirname, "init.sql"), "utf-8");
    await pool.query(initSQL);
    console.log("Database initialized & seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  }
}

if (require.main === module) {
  seedDatabase();
}

export default pool;
