import { addMonths, endOfMonth, startOfMonth } from "date-fns";
import { NextResponse } from "next/server";

import { fetchFreeBusy } from "@/lib/google-calendar-server";

export const dynamic = "force-dynamic";

function parseDateParam(v: string | null, fallback: Date): Date {
  if (!v) return fallback;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return fallback;
  return d;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const now = new Date();
    const defaultFrom = startOfMonth(now);
    const defaultTo = endOfMonth(addMonths(now, 2));

    const timeMin = parseDateParam(searchParams.get("from"), defaultFrom);
    let timeMax = parseDateParam(searchParams.get("to"), defaultTo);
    if (timeMax <= timeMin) {
      timeMax = new Date(timeMin.getTime() + 86400000);
    }

    const maxSpanMs = 120 * 86400000;
    if (timeMax.getTime() - timeMin.getTime() > maxSpanMs) {
      return NextResponse.json(
        { error: "Range too large (max 120 days)." },
        { status: 400 },
      );
    }

    const busy = await fetchFreeBusy({ timeMin, timeMax });
    return NextResponse.json(
      {
        busy,
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    const isConfig = message.includes("Missing required environment");
    return NextResponse.json(
      {
        error: isConfig
          ? "Calendar integration is not configured on the server."
          : "Google Calendar is temporarily unavailable.",
        details: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: isConfig ? 503 : 502 },
    );
  }
}
