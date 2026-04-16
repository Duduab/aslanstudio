import { NextResponse } from "next/server";

import { jerusalemInstant } from "@/lib/availability-math";
import { resolveGoogleCalendarRouteError } from "@/lib/google-calendar-route-errors";
import { fetchFreeBusy, insertStudioBooking } from "@/lib/google-calendar-server";
import { parseTimeSlot } from "@/lib/time-slot";
import { STUDIO_CLOSE_HOUR, STUDIO_OPEN_HOUR } from "@/lib/studio-calendar-config";

export const dynamic = "force-dynamic";

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

type BookBody = {
  name?: unknown;
  phone?: unknown;
  date?: unknown;
  /** Preferred: "HH:mm-HH:mm" (also accepts – or —). */
  timeSlot?: unknown;
  startTime?: unknown;
  endTime?: unknown;
};

function hourFromLabel(label: string): number {
  return Number(label.slice(0, 2));
}

function overlaps(a0: Date, a1: Date, b0: Date, b1: Date): boolean {
  return a0 < b1 && a1 > b0;
}

function resolveTimes(body: BookBody): { startTime: string; endTime: string } | null {
  if (typeof body.timeSlot === "string" && body.timeSlot.trim()) {
    return parseTimeSlot(body.timeSlot);
  }
  const st =
    typeof body.startTime === "string" ? body.startTime.trim() : "";
  const et = typeof body.endTime === "string" ? body.endTime.trim() : "";
  if (TIME_RE.test(st) && TIME_RE.test(et)) return { startTime: st, endTime: et };
  return null;
}

export async function POST(request: Request) {
  try {
    let body: BookBody;
    try {
      body = (await request.json()) as BookBody;
    } catch {
      return NextResponse.json(
        { error: "גוף הבקשה אינו JSON תקין." },
        { status: 400 },
      );
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const dateIso = typeof body.date === "string" ? body.date.trim() : "";
    const times = resolveTimes(body);

    if (!name || name.length > 200) {
      return NextResponse.json({ error: "שם לא תקין." }, { status: 400 });
    }
    if (!phone || phone.replace(/\D/g, "").length < 9) {
      return NextResponse.json({ error: "מספר טלפון לא תקין." }, { status: 400 });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateIso)) {
      return NextResponse.json(
        { error: "תאריך לא תקין (יש להשתמש ב־YYYY-MM-DD)." },
        { status: 400 },
      );
    }
    if (!times) {
      return NextResponse.json(
        {
          error:
            "חסר מקטע זמן תקין. נא לשלוח timeSlot בפורמט HH:mm-HH:mm (למשל 09:00-12:00).",
        },
        { status: 400 },
      );
    }

    const { startTime, endTime } = times;
    const sh = hourFromLabel(startTime);
    const eh = hourFromLabel(endTime);
    if (sh < STUDIO_OPEN_HOUR || eh > STUDIO_CLOSE_HOUR || eh <= sh) {
      return NextResponse.json(
        { error: "שעות מחוץ לחלון ההשכרה (09:00–21:00)." },
        { status: 400 },
      );
    }

    const winStart = jerusalemInstant(
      dateIso,
      sh,
      Number(startTime.slice(3, 5)) || 0,
    );
    const winEnd = jerusalemInstant(
      dateIso,
      eh,
      Number(endTime.slice(3, 5)) || 0,
    );

    const busy = await fetchFreeBusy({
      timeMin: new Date(winStart.getTime() - 3600000),
      timeMax: new Date(winEnd.getTime() + 3600000),
    });

    for (const b of busy) {
      const b0 = new Date(b.start);
      const b1 = new Date(b.end);
      if (overlaps(winStart, winEnd, b0, b1)) {
        return NextResponse.json(
          { error: "המשבצת כבר תפוסה ביומן. בחרו זמן אחר." },
          { status: 409 },
        );
      }
    }

    const { id } = await insertStudioBooking({
      name,
      phone,
      dateIso,
      startTime,
      endTime,
    });

    return NextResponse.json({
      ok: true,
      eventId: id ?? null,
      message: "ההזמנה נרשמה ביומן הסטודיו בהצלחה.",
    });
  } catch (e) {
    const { status, error, details } = resolveGoogleCalendarRouteError(e, {
      vercelEnvHint:
        "בדקו משתני סביבה ב־Vercel (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN).",
      localEnvHint:
        "הוסיפו משתנים אלה לקובץ .env.local (שם מדויק; לא .env.local.) ואז הריצו מחדש את שרת הפיתוח.",
    });
    const body =
      status === 502
        ? {
            error: "לא ניתן ליצור את האירוע ביומן כרגע. נסו שוב בעוד רגע.",
            details,
          }
        : { error, details };
    return NextResponse.json(body, { status });
  }
}
