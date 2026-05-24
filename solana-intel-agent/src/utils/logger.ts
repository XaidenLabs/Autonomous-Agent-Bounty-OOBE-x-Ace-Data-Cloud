// src/utils/logger.ts
// Writes every loop result to a JSONL file.
// This file is your submission evidence and feeds the React dashboard.

import fs from "fs";
import path from "path";

const LOG_DIR = path.join(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "runs.jsonl");

// Ensure log directory exists on module load.
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * Append one JSON line per loop to the log file.
 * The file is append-only — never truncated.
 */
export function writeLog(entry: object): void {
  const line = JSON.stringify(entry) + "\n";
  fs.appendFileSync(LOG_FILE, line, "utf-8");
}

/**
 * Read all log entries in chronological order.
 * Used by the dashboard API endpoint.
 * Returns last N entries (default 200) to keep API response manageable.
 */
export function readLogs(limit = 200): object[] {
  if (!fs.existsSync(LOG_FILE)) return [];

  const all = fs
    .readFileSync(LOG_FILE, "utf-8")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  // Return last `limit` entries, newest first
  return all.slice(-limit).reverse();
}

/**
 * Count total log entries without loading them all.
 */
export function countLogs(): number {
  if (!fs.existsSync(LOG_FILE)) return 0;
  return fs
    .readFileSync(LOG_FILE, "utf-8")
    .split("\n")
    .filter(Boolean).length;
}

export { LOG_FILE };
