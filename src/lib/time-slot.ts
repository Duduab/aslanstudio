const HHMM = /^([01]\d|2[0-3]):([0-5]\d)$/;

/** Splits "09:00-12:00", "09:00–12:00" (en dash), or "09:00—12:00" (em dash). */
export function parseTimeSlot(timeSlot: string): {
  startTime: string;
  endTime: string;
} | null {
  const compact = timeSlot.trim().replace(/\s+/g, "");
  const parts = compact.split(/[-–—]/).filter(Boolean);
  if (parts.length !== 2) return null;
  const [a, b] = parts;
  if (!HHMM.test(a) || !HHMM.test(b)) return null;
  return { startTime: a, endTime: b };
}
