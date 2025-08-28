import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ใช้ไฟล์ในโฟลเดอร์ data (สร้างถ้าไม่มี)
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const dbFile = path.join(dataDir, 'data.sqlite');

export async function getDB() {
  const db = await open({
    filename: dbFile,
    driver: sqlite3.Database
  });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT,
      details TEXT,
      priority TEXT,
      createdAt TEXT NOT NULL
    );
  `);
  return db;
}
