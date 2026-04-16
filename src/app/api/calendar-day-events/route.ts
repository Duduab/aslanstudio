import { NextResponse } from "next/server";

import { resolveGoogleCalendarRouteError } from "@/lib/google-calendar-route-errors";
import { listStudioCalendarDayEvents } from "@/lib/google-calendar-server";

export const dynamic = "force-dynamic";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date")?.trim() ?? "";
    if (!DATE_RE.test(date)) {
      return NextResponse.json(
        { error: "פרמטר date חייב להיות בפורמט yyyy-MM-dd." },
        { status: 400 },
      );
    }

    const events = await listStudioCalendarDayEvents(date);
    return NextResponse.json(
      { events },
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
