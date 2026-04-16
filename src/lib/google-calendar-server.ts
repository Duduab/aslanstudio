import { addDays, format, parseISO } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

import type { BusyInterval } from "@/lib/availability-math";
import { STUDIO_TZ } from "@/lib/studio-calendar-config";
import type { StudioCalendarDayEvent } from "@/lib/studio-calendar-day-event";

/**
 * Uses GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN (e.g. on Vercel).
 * The refresh token must belong to aslanstudiobs@gmail.com (or whichever account owns the studio calendar).
 * Default calendar id is `primary` → that account’s primary calendar.
 */

function requireEnv(name: string): string {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

function getOAuthClient(): OAuth2Client {
  const clientId = requireEnv("GOOGLE_CLIENT_ID");
  const clientSecret = requireEnv("GOOGLE_CLIENT_SECRET");
  const refreshToken = requireEnv("GOOGLE_REFRESH_TOKEN");
  const client = new OAuth2Client({ clientId, clientSecret });
  client.setCredentials({ refresh_token: refreshToken });
  return client;
}

export function getCalendarId(): string {
  return process.env.GOOGLE_CALENDAR_ID?.trim() || "primary";
}

/** Google rejects long single freeBusy windows ("time range too long"). Chunk well under ~90d. */
const FREE_BUSY_CHUNK_MS = 21 * 24 * 60 * 60 * 1000;

async function fetchFreeBusyChunk(
  auth: ReturnType<typeof getOAuthClient>,
  timeMin: Date,
  timeMax: Date,
): Promise<BusyInterval[]> {
  const calendar = google.calendar({ version: "v3", auth });
  const calendarId = getCalendarId();

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      timeZone: STUDIO_TZ,
      items: [{ id: calendarId }],
    },
  });

  const busy = res.data.calendars?.[calendarId]?.busy ?? [];
  return busy
    .filter((b) => b.start && b.end)
    .map((b) => ({ start: b.start as string, end: b.end as string }));
}

/** Merges sequential freeBusy chunk results (dedupes identical intervals). */
export async function fetchFreeBusy(params: {
  timeMin: Date;
  timeMax: Date;
}): Promise<BusyInterval[]> {
  const auth = getOAuthClient();
  const t0 = params.timeMin.getTime();
  const t1 = params.timeMax.getTime();
  if (t1 <= t0) return [];

  const byKey = new Map<string, BusyInterval>();
  let cursor = t0;

  while (cursor < t1) {
    const chunkEnd = Math.min(cursor + FREE_BUSY_CHUNK_MS, t1);
    const chunkBusy = await fetchFreeBusyChunk(
      auth,
      new Date(cursor),
      new Date(chunkEnd),
    );
    for (const b of chunkBusy) {
      byKey.set(`${b.start}\t${b.end}`, b);
    }
    cursor = chunkEnd;
  }

  return Array.from(byKey.values());
}

export async function insertStudioBooking(params: {
  name: string;
  phone: string;
  dateIso: string;
  startTime: string;
  endTime: string;
}): Promise<{ id: string | null | undefined }> {
  const auth = getOAuthClient();
  const calendar = google.calendar({ version: "v3", auth });
  const calendarId = getCalendarId();

  const summary = `הזמנת סטודיו - ${params.name}`;
  const description = `טלפון: ${params.phone}`;

  const toDateTime = (dateIso: string, hhmm: string) =>
    hhmm.length === 5 ? `${dateIso}T${hhmm}:00` : `${dateIso}T${hhmm}`;

  const res = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary,
      description,
      start: {
        dateTime: toDateTime(params.dateIso, params.startTime),
        timeZone: STUDIO_TZ,
      },
      end: {
        dateTime: toDateTime(params.dateIso, params.endTime),
        timeZone: STUDIO_TZ,
      },
    },
  });

  return { id: res.data.id };
}

function nextDateIso(dateIso: string): string {
  return format(addDays(parseISO(`${dateIso}T12:00:00`), 1), "yyyy-MM-dd");
}

/** Lists non-cancelled events on a given civil day in `STUDIO_TZ` (for the studio calendar). */
export async function listStudioCalendarDayEvents(
  dateIso: string,
): Promise<StudioCalendarDayEvent[]> {
  const auth = getOAuthClient();
  const calendar = google.calendar({ version: "v3", auth });
  const calendarId = getCalendarId();

  const timeMin = fromZonedTime(`${dateIso} 00:00:00`, STUDIO_TZ).toISOString();
  const timeMax = fromZonedTime(`${nextDateIso(dateIso)} 00:00:00`, STUDIO_TZ).toISOString();

  const res = await calendar.events.list({
    calendarId,
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 250,
    showDeleted: false,
  });

  const items = res.data.items ?? [];
  const rows: StudioCalendarDayEvent[] = [];

  for (const e of items) {
    if (!e.id || e.status === "cancelled") continue;
    const summary = (e.summary || "").trim() || "אירוע";

    let timeLabel = "";
    if (e.start?.dateTime && e.end?.dateTime) {
      const s = formatInTimeZone(e.start.dateTime, STUDIO_TZ, "HH:mm");
      const en = formatInTimeZone(e.end.dateTime, STUDIO_TZ, "HH:mm");
      timeLabel = `${s}–${en}`;
    } else if (e.start?.date) {
      timeLabel = "כל היום";
    }

    rows.push({ id: e.id, summary, timeLabel });
  }

  return rows;
}
