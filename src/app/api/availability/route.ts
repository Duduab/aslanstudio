import { addMonths, endOfMonth, startOfMonth } from "date-fns";
import { NextResponse } from "next/server";

import { resolveGoogleCalendarRouteError } from "@/lib/google-calendar-route-errors";
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

    // Wide ranges are OK: fetchFreeBusy chunks requests for Google’s limits.
    const maxSpanMs = 548 * 86400000;
    if (timeMax.getTime() - timeMin.getTime() > maxSpanMs) {
      return NextResponse.json(
        { error: "טווח התאריכים גדול מדי (מקסימום כ־18 חודשים)." },
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
    const { status, error, details } = resolveGoogleCalendarRouteError(e, {
      vercelEnvHint:
        "בדקו משתני סביבה ב־Vercel (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN).",
      localEnvHint:
        "הוסיפו משתנים אלה לקובץ .env.local (שם מדויק; לא .env.local.) ואז הריצו מחדש את שרת הפיתוח.",
    });
    return NextResponse.json({ error, details }, { status });
  }
}
