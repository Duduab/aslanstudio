import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

import type { BusyInterval } from "@/lib/availability-math";
import { STUDIO_TZ } from "@/lib/studio-calendar-config";

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

export async function fetchFreeBusy(params: {
  timeMin: Date;
  timeMax: Date;
}): Promise<BusyInterval[]> {
  const auth = getOAuthClient();
  const calendar = google.calendar({ version: "v3", auth });
  const calendarId = getCalendarId();

  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: params.timeMin.toISOString(),
      timeMax: params.timeMax.toISOString(),
      timeZone: STUDIO_TZ,
      items: [{ id: calendarId }],
    },
  });

  const busy = res.data.calendars?.[calendarId]?.busy ?? [];
  return busy
    .filter((b) => b.start && b.end)
    .map((b) => ({ start: b.start as string, end: b.end as string }));
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
  const description = [
    `טלפון: ${params.phone}`,
    `תאריך: ${params.dateIso}`,
    `שעות: ${params.startTime} – ${params.endTime}`,
  ].join("\n");

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
