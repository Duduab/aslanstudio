import { NextResponse } from "next/server";

import { jerusalemInstant } from "@/lib/availability-math";
import { fetchFreeBusy, insertStudioBooking } from "@/lib/google-calendar-server";
import { STUDIO_CLOSE_HOUR, STUDIO_OPEN_HOUR } from "@/lib/studio-calendar-config";

export const dynamic = "force-dynamic";

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

type BookBody = {
  name?: unknown;
  phone?: unknown;
  date?: unknown;
  startTime?: unknown;
  endTime?: unknown;
};

function hourFromLabel(label: string): number {
  return Number(label.slice(0, 2));
}

function overlaps(a0: Date, a1: Date, b0: Date, b1: Date): boolean {
  return a0 < b1 && a1 > b0;
}

export async function POST(request: Request) {
  try {
    let body: BookBody;
    try {
      body = (await request.json()) as BookBody;
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const dateIso = typeof body.date === "string" ? body.date.trim() : "";
    const startTime =
      typeof body.startTime === "string" ? body.startTime.trim() : "";
    const endTime = typeof body.endTime === "string" ? body.endTime.trim() : "";

    if (!name || name.length > 200) {
      return NextResponse.json({ error: "Invalid name." }, { status: 400 });
    }
    if (!phone || phone.replace(/\D/g, "").length < 9) {
      return NextResponse.json({ error: "Invalid phone." }, { status: 400 });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateIso)) {
      return NextResponse.json({ error: "Invalid date (use YYYY-MM-DD)." }, {
        status: 400,
      });
    }
    if (!TIME_RE.test(startTime) || !TIME_RE.test(endTime)) {
      return NextResponse.json(
        { error: "Invalid startTime or endTime (use HH:mm)." },
        { status: 400 },
      );
    }

    const sh = hourFromLabel(startTime);
    const eh = hourFromLabel(endTime);
    if (sh < STUDIO_OPEN_HOUR || eh > STUDIO_CLOSE_HOUR || eh <= sh) {
      return NextResponse.json({ error: "Invalid studio hours." }, {
        status: 400,
      });
    }

    const winStart = jerusalemInstant(dateIso, sh, Number(startTime.slice(3, 5)) || 0);
    const winEnd = jerusalemInstant(dateIso, eh, Number(endTime.slice(3, 5)) || 0);

    const busy = await fetchFreeBusy({
      timeMin: new Date(winStart.getTime() - 3600000),
      timeMax: new Date(winEnd.getTime() + 3600000),
    });

    for (const b of busy) {
      const b0 = new Date(b.start);
      const b1 = new Date(b.end);
      if (overlaps(winStart, winEnd, b0, b1)) {
        return NextResponse.json(
          { error: "That time slot is no longer available." },
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

    return NextResponse.json({ ok: true, eventId: id ?? null });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    const isConfig = message.includes("Missing required environment");
    return NextResponse.json(
      {
        error: isConfig
          ? "Calendar integration is not configured on the server."
          : "Could not create the calendar event.",
        details: process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: isConfig ? 503 : 502 },
    );
  }
}
