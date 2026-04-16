import type { BookingPayload } from "@/lib/booking-types";
import { PAYMENT_LABELS } from "@/lib/booking-types";

/** Parse yyyy-MM-dd + HH:mm in the user's local timezone. */
export function parseDateAndTime(dateIso: string, timeHm: string): Date {
  const [y, mo, d] = dateIso.split("-").map(Number);
  const [h, mi] = timeHm.split(":").map(Number);
  return new Date(y, mo - 1, d, h, mi, 0, 0);
}

/** Google Calendar TEMPLATE dates: YYYYMMDDTHHmmss (local with ctz). */
function formatGoogleCalendarRange(start: Date, end: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const piece = (dt: Date) =>
    `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`;
  return `${piece(start)}/${piece(end)}`;
}

/**
 * Opens Google Calendar “create event” with fields prefilled.
 * User still taps Save in Google — no server OAuth required.
 */
export function buildGoogleCalendarTemplateUrl(booking: BookingPayload): string {
  const start = parseDateAndTime(booking.dateIso, booking.startHour);
  const end = parseDateAndTime(booking.dateIso, booking.endHour);
  const dates = formatGoogleCalendarRange(start, end);
  const text = `השכרת סטודיו — ${booking.fullName}`;
  const details = [
    `שם: ${booking.fullName}`,
    `טלפון: ${booking.phone}`,
    `דוא״ל: ${booking.email}`,
    `תשלום: ${PAYMENT_LABELS[booking.payment]}`,
    "",
    "נוצר דרך מערכת ההזמנות באתר.",
  ].join("\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text,
    dates,
    details,
    ctz: "Asia/Jerusalem",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
