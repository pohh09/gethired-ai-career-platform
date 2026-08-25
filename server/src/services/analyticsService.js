import AnalyticsEvent from "../models/AnalyticsEvent.js";
import User from "../models/User.js";

/**
 * Asynchronously tracks an analytics event in a non-blocking fire-and-forget manner.
 * Never throws or blocks main request/response lifecycle.
 *
 * @param {string|mongoose.Types.ObjectId|null} userId - The user ID associated with the event
 * @param {string} eventType - The action type (e.g. 'login', 'job_search', 'resume_analyze')
 * @param {object} [metadata={}] - Additional context attributes (sanitized, non-sensitive)
 */
export async function trackEvent(userId = null, eventType = "", metadata = {}) {
  if (!eventType) return;

  // Run asynchronously without blocking caller
  setImmediate(async () => {
    try {
      // 1. Create AnalyticsEvent record
      await AnalyticsEvent.create({
        userId: userId || null,
        eventType,
        metadata: typeof metadata === "object" && metadata !== null ? metadata : {},
        timestamp: new Date(),
      });

      // 2. If userId provided, update User's lastActiveAt
      if (userId) {
        await User.findByIdAndUpdate(userId, {
          lastActiveAt: new Date(),
        }).catch(() => {});
      }
    } catch (err) {
      // Silent telemetry catch to guarantee zero impact on live user transactions
      console.warn(`[Telemetry Warning] Failed to log event "${eventType}":`, err.message);
    }
  });
}

export default {
  trackEvent,
};
