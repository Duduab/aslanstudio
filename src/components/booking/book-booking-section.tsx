"use client";

import {
  addMonths,
  endOfMonth,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import * as React from "react";

import { BookingCalendar } from "@/components/booking/booking-calendar";
import { BookingContactModal } from "@/components/booking/booking-contact-modal";
import { BookingDetailsModal } from "@/components/booking/booking-details-modal";
import { BookingSummaryModal } from "@/components/booking/booking-summary-modal";
import {
  fullyBlockedDateIsoList,
  type BusyInterval,
} from "@/lib/availability-math";
import type { BookingContact, BookingPayload } from "@/lib/booking-types";
import { loadMeetings, meetingsOnDate, type StoredMeeting } from "@/lib/meetings-storage";

async function fetchAvailabilityRange(
  fromIso: string,
  toIso: string,
): Promise<BusyInterval[]> {
  const q = new URLSearchParams({ from: fromIso, to: toIso });
  const res = await fetch(`/api/availability?${q.toString()}`, {
    cache: "no-store",
  });
  const data = (await res.json()) as { busy?: BusyInterval[]; error?: string };
  if (!res.ok) {
    throw new Error(data.error || "שגיאה בטעינת הזמינות.");
  }
  return data.busy ?? [];
}

export function BookBookingSection() {
  const [busy, setBusy] = React.useState<BusyInterval[]>([]);
  const [availabilityError, setAvailabilityError] = React.useState<
    string | null
  >(null);

  const loadAvailability = React.useCallback(async () => {
    const from = format(startOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd");
    const to = format(endOfMonth(addMonths(new Date(), 4)), "yyyy-MM-dd");
    try {
      const list = await fetchAvailabilityRange(from, to);
      setBusy(list);
      setAvailabilityError(null);
    } catch (e) {
      setBusy([]);
      setAvailabilityError(
        e instanceof Error ? e.message : "לא ניתן לטעון זמינות מגוגל.",
      );
    }
  }, []);

  React.useEffect(() => {
    void loadAvailability();
  }, [loadAvailability]);

  React.useEffect(() => {
    const onFocus = () => {
      void loadAvailability();
    };
    window.addEventListener("focus", onFocus);
    const id = window.setInterval(() => {
      void loadAvailability();
    }, 120_000);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.clearInterval(id);
    };
  }, [loadAvailability]);

  const blockedDates = React.useMemo(() => {
    if (busy.length === 0) return [];
    const from = format(startOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd");
    const to = format(endOfMonth(addMonths(new Date(), 4)), "yyyy-MM-dd");
    const blockedIso = fullyBlockedDateIsoList(busy, from, to);
    const today = startOfDay(new Date());
    return blockedIso
      .map((iso) => startOfDay(parseISO(`${iso}T12:00:00`)))
      .filter((d) => d >= today);
  }, [busy]);

  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [meetingsSnapshot, setMeetingsSnapshot] = React.useState<
    StoredMeeting[]
  >([]);

  React.useEffect(() => {
    setMeetingsSnapshot(loadMeetings());
  }, []);

  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [contactOpen, setContactOpen] = React.useState(false);
  const [summaryOpen, setSummaryOpen] = React.useState(false);

  const [timeRange, setTimeRange] = React.useState<{
    startHour: string;
    endHour: string;
  } | null>(null);

  const [draftBooking, setDraftBooking] = React.useState<BookingPayload | null>(
    null,
  );

  const dateIso = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : null;

  const dayMeetings = React.useMemo(() => {
    if (!dateIso) return [];
    return meetingsOnDate(meetingsSnapshot, dateIso);
  }, [dateIso, meetingsSnapshot]);

  return (
    <>
      <BookingCalendar
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onRequestDetails={() => setDetailsOpen(true)}
        blockedDates={blockedDates}
        busyIntervals={busy}
        dayMeetings={dayMeetings}
        availabilityError={availabilityError}
      />

      <BookingDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        selectedDate={selectedDate}
        busyIntervals={busy}
        onStepComplete={(payload) => {
          setTimeRange(payload);
          setContactOpen(true);
        }}
      />

      <BookingContactModal
        open={contactOpen}
        onOpenChange={setContactOpen}
        onContinue={async (contact: BookingContact) => {
          if (!timeRange || !dateIso) {
            throw new Error("חסרים נתוני תאריך או שעות.");
          }
          const res = await fetch("/api/book", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: contact.fullName,
              phone: contact.phone,
              date: dateIso,
              startTime: timeRange.startHour,
              endTime: timeRange.endHour,
            }),
          });
          const data = (await res.json()) as { ok?: boolean; error?: string };
          if (!res.ok) {
            throw new Error(data.error || "ההזמנה לא נשמרה.");
          }
          const booking: BookingPayload = {
            ...timeRange,
            ...contact,
            dateIso,
          };
          setDraftBooking(booking);
          setContactOpen(false);
          setSummaryOpen(true);
          await loadAvailability();
        }}
      />

      <BookingSummaryModal
        open={summaryOpen}
        onOpenChange={(open) => {
          setSummaryOpen(open);
          if (!open) {
            setDraftBooking(null);
            setTimeRange(null);
            setSelectedDate(null);
          }
        }}
        booking={draftBooking}
        selectedDate={selectedDate}
      />
    </>
  );
}
