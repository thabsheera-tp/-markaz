import { query } from './db.js';

// In-memory fallback sliding window rate limiter
const tracker = new Map();

// Periodic cleanup of expired in-memory entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of tracker.entries()) {
      if (now > record.resetTime) {
        tracker.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

/**
 * Check if an action by an identifier is within the allowed limit.
 * Backed by PostgreSQL for multi-region & serverless persistence with in-memory fallback.
 *
 * @param {string} key - Unique key, e.g. `login:${ip}` or `donate:${ip}`
 * @param {number} maxRequests - Max requests permitted in the window
 * @param {number} windowMs - Window duration in milliseconds
 * @returns {Promise<{ success: boolean, remaining: number, resetTime: number }>}
 */
export async function checkRateLimit(key, maxRequests = 10, windowMs = 60 * 1000) {
  const now = Date.now();
  const newResetTime = now + windowMs;

  try {
    // Attempt database-backed atomic upsert
    const res = await query.get(
      `INSERT INTO rate_limits (key, count, reset_time)
       VALUES (?, 1, ?)
       ON CONFLICT (key) DO UPDATE
       SET count = CASE
         WHEN rate_limits.reset_time < ? THEN 1
         ELSE rate_limits.count + 1
       END,
       reset_time = CASE
         WHEN rate_limits.reset_time < ? THEN ?
         ELSE rate_limits.reset_time
       END
       RETURNING count, reset_time`,
      [key, newResetTime, now, now, newResetTime]
    );

    if (res && res.count !== undefined) {
      const count = Number(res.count);
      const resetTime = Number(res.reset_time);
      if (count > maxRequests) {
        return {
          success: false,
          remaining: 0,
          resetTime,
        };
      }
      return {
        success: true,
        remaining: Math.max(0, maxRequests - count),
        resetTime,
      };
    }
  } catch (err) {
    // Graceful fallback to memory tracker if DB is temporarily unreachable
  }

  // In-memory fallback
  const record = tracker.get(key);

  if (!record || now > record.resetTime) {
    tracker.set(key, {
      count: 1,
      resetTime: newResetTime,
    });
    return {
      success: true,
      remaining: maxRequests - 1,
      resetTime: newResetTime,
    };
  }

  if (record.count >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  };
}
