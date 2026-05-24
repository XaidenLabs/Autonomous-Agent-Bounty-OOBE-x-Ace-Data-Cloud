// src/utils/retry.ts
// Wraps any async function with exponential backoff retry logic.
// Essential for production daemons — network calls fail occasionally.

export async function withRetry<T>(
  fn: () => Promise<T>,
  label: string,
  maxAttempts = 3,
  baseDelayMs = 2000
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts) {
        console.error(`[RETRY] ${label} failed after ${maxAttempts} attempts.`);
        throw err;
      }
      const delay = baseDelayMs * Math.pow(2, attempt - 1); // 2s, 4s, 8s
      console.warn(
        `[RETRY] ${label} attempt ${attempt} failed. ` +
          `Retrying in ${delay / 1000}s... Error: ${String(err).slice(0, 120)}`
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("Unreachable");
}
