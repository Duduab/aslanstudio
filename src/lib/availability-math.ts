import { eachDayOfInterval, format, parseISO } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

import {
  STUDIO_CLOSE_HOUR,
  STUDIO_OPEN_HOUR,
  STUDIO_TZ,
} from "@/lib/studio-calendar-config";

export type BusyInterval = { start: string; end: string };

/** Wall-clock instant in Jerusalem (interpreted as local civil time in STUDIO_TZ). */
export function jerusalemInstant(
  dateIso: string,
  hour: number,
  minute = 0,
): Date {
  const pad = (n: number) => String(n).padStart(2, "0");
  return fromZonedTime(
    `${dateIso} ${pad(hour)}:${pad(minute)}:00`,
    STUDIO_TZ,
  );
}

function overlapsHalfOpen(a0: Date, a1: Date, b0: Date, b1: Date): boolean {
  return a0 < b1 && a1 > b0;
}

/** Studio window for one calendar day: [open, close) in absolute time. */
export function studioDayWindow(dateIso: string): { start: Date; end: Date } {
  return {
    start: jerusalemInstant(dateIso, STUDIO_OPEN_HOUR, 0),
    end: jerusalemInstant(dateIso, STUDIO_CLOSE_HOUR, 0),
  };
}

/** Clip busy interval to the studio window; null if no overlap. */
function clipToWindow(
  busyStart: Date,
  busyEnd: Date,
  winStart: Date,
  winEnd: Date,
): { start: Date; end: Date } | null {
  const s = busyStart < winStart ? winStart : busyStart;
  const e = busyEnd > winEnd ? winEnd : busyEnd;
  if (s >= e) return null;
  return { start: s, end: e };
}

export function busyClipsForDay(
  busy: BusyInterval[],
  dateIso: string,
): { start: Date; end: Date }[] {
  const { start: w0, end: w1 } = studioDayWindow(dateIso);
  const out: { start: Date; end: Date }[] = [];
  for (const b of busy) {
    const bs = new Date(b.start);
    const be = new Date(b.end);
    const c = clipToWindow(bs, be, w0, w1);
    if (c) out.push(c);
  }
  return out;
}

/** Booking as [startHour, endHour) wall hours on dateIso. */
function bookingRange(dateIso: string, startHour: number, endHour: number) {
  return {
    s: jerusalemInstant(dateIso, startHour, 0),
    e: jerusalemInstant(dateIso, endHour, 0),
  };
}

function bookingOverlapsBusy(
  dateIso: string,
  startHour: number,
  endHour: number,
  clips: { start: Date; end: Date }[],
): boolean {
  const { s, e } = bookingRange(dateIso, startHour, endHour);
  for (const c of clips) {
    if (overlapsHalfOpen(s, e, c.start, c.end)) return true;
  }
  return false;
}

/** True if at least one valid (start,end) studio slot does not overlap busy. */
export function dayHasAvailableSlot(
  dateIso: string,
  busy: BusyInterval[],
): boolean {
  for (let s = STUDIO_OPEN_HOUR; s < STUDIO_CLOSE_HOUR; s++) {
    for (let e = s + 1; e <= STUDIO_CLOSE_HOUR; e++) {
      if (!bookingOverlapsBusy(dateIso, s, e, busyClipsForDay(busy, dateIso))) {
        return true;
      }
    }
  }
  return false;
}

/** True if Google reports any busy time overlapping studio hours that day. */
export function dayHasAnyBusy(dateIso: string, busy: BusyInterval[]): boolean {
  return busyClipsForDay(busy, dateIso).length > 0;
}

/** YYYY-MM-DD strings in [rangeStart, rangeEnd] with no available slot. */
export function fullyBlockedDateIsoList(
  busy: BusyInterval[],
  rangeStartIso: string,
  rangeEndIso: string,
): string[] {
  const days = eachDayOfInterval({
    start: parseISO(rangeStartIso),
    end: parseISO(rangeEndIso),
  });
  const out: string[] = [];
  for (const d of days) {
    const dateIso = format(d, "yyyy-MM-dd");
    if (!dayHasAvailableSlot(dateIso, busy)) out.push(dateIso);
  }
  return out;
}

export function disabledStartHours(
  dateIso: string,
  busy: BusyInterval[],
): Set<number> {
  const clips = busyClipsForDay(busy, dateIso);
  const bad = new Set<number>();
  for (let s = STUDIO_OPEN_HOUR; s < STUDIO_CLOSE_HOUR; s++) {
    let anyOk = false;
    for (let e = s + 1; e <= STUDIO_CLOSE_HOUR; e++) {
      if (!bookingOverlapsBusy(dateIso, s, e, clips)) {
        anyOk = true;
        break;
      }
    }
    if (!anyOk) bad.add(s);
  }
  return bad;
}

export function disabledEndHours(
  dateIso: string,
  startHour: number,
  busy: BusyInterval[],
): Set<number> {
  const clips = busyClipsForDay(busy, dateIso);
  const bad = new Set<number>();
  for (let e = startHour + 1; e <= STUDIO_CLOSE_HOUR; e++) {
    if (bookingOverlapsBusy(dateIso, startHour, e, clips)) bad.add(e);
  }
  return bad;
}
