import { SQLiteDatabase } from "expo-sqlite";

export const DB_NAME = "1111    1111r11111111.db";

export const createDbIfNeeded = async (db: SQLiteDatabase) => {
  try {
    await db.execAsync("PRAGMA foreign_keys = ON;");

    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        purpose TEXT NOT NULL,
        created_at INTEGER,
        done_times INTEGER DEFAULT 0 
      );`
    );

    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habit_id INTEGER NOT NULL,
        done_at INTEGER NOT NULL,
        FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
      );`
    );

    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS metadata (
        key TEXT PRIMARY KEY,
        value TEXT
      )`
    );

    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};
