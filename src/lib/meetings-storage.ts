import type { BookingPayload } from "@/lib/booking-types";

const STORAGE_KEY = "studio-rent-bookings-v1";

export type StoredMeeting = BookingPayload & {
  id: string;
  createdAt: string;
};

function safeParse(raw: string | null): StoredMeeting[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter(
      (x): x is StoredMeeting =>
        x &&
        typeof x === "object" &&
        typeof (x as StoredMeeting).id === "string" &&
        typeof (x as StoredMeeting).dateIso === "string"
    );
  } catch {
    return [];
  }
}

export function loadMeetings(): StoredMeeting[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

export function persistMeetings(meetings: StoredMeeting[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(meetings));
}

export function addStoredMeeting(payload: BookingPayload): StoredMeeting {
  const list = loadMeetings();
  const meeting: StoredMeeting = {
    ...payload,
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `m-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  list.push(meeting);
  persistMeetings(list);
  return meeting;
}

export function meetingsOnDate(
  meetings: StoredMeeting[],
  dateIso: string
): StoredMeeting[] {
  return meetings
    .filter((m) => m.dateIso === dateIso)
    .sort((a, b) => a.startHour.localeCompare(b.startHour));
}
