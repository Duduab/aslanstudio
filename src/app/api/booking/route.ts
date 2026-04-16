import { NextResponse } from "next/server";
import { Resend } from "resend";

import type { BookingPayload } from "@/lib/booking-types";

/** Studio inbox for new booking alerts (override with BOOKING_NOTIFY_EMAIL). */
const DEFAULT_STUDIO_BOOKING_EMAIL = "aslanstudiobs@gmail.com";

function isValidPayload(x: unknown): x is BookingPayload {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  if (typeof o.fullName !== "string" || !o.fullName.trim()) return false;
  if (typeof o.phone !== "string" || o.phone.replace(/\D/g, "").length < 9)
    return false;
  if (typeof o.dateIso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(o.dateIso))
    return false;
  if (typeof o.startHour !== "string" || typeof o.endHour !== "string")
    return false;
  return true;
}

function buildOwnerEmailText(body: BookingPayload): string {
  return [
    "הזמנה חדשה התקבלה באתר.",
    "",
    "שם: " + body.fullName,
    "טלפון: " + body.phone,
    "תאריך: " + body.dateIso,
    "שעות: " + body.startHour + " – " + body.endHour,
  ].join("\n");
}

/** Optional Resend notification (calendar is source of truth via /api/book). */
export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "גוף הבקשה אינו JSON תקין." },
      { status: 400 },
    );
  }

  if (!isValidPayload(raw)) {
    return NextResponse.json(
      { ok: false, error: "שדות חסרים או לא תקינים." },
      { status: 400 },
    );
  }

  const body = raw;
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    console.info("[booking] RESEND_API_KEY missing; payload:", body);
    return NextResponse.json({ ok: true, sent: false });
  }

  const resend = new Resend(key);
  const from =
    process.env.BOOKING_FROM_EMAIL ?? "Studio Rent <onboarding@resend.dev>";
  const notify =
    process.env.BOOKING_NOTIFY_EMAIL?.trim() || DEFAULT_STUDIO_BOOKING_EMAIL;

  const ownerResult = await resend.emails.send({
    from,
    to: notify,
    subject: "הזמנה חדשה: " + body.fullName.trim(),
    text: buildOwnerEmailText(body),
  });
  if (ownerResult.error) {
    return NextResponse.json(
      { ok: false, error: ownerResult.error.message },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, sent: true });
}
