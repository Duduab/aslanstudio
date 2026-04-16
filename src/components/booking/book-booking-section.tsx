"use client";

import { format, parseISO, startOfDay } from "date-fns";
import * as React from "react";

import { BookingCalendar } from "@/components/booking/booking-calendar";
import { BookingContactModal } from "@/components/booking/booking-contact-modal";
import { BookingDetailsModal } from "@/components/booking/booking-details-modal";
import { BookingSummaryModal } from "@/components/booking/booking-summary-modal";
import type { BookingContact, BookingPayload } from "@/lib/booking-types";
import {
  addStoredMeeting,
  loadMeetings,
  meetingsOnDate,
  type StoredMeeting,
} from "@/lib/meetings-storage";

function parseBlocked(isoStrings: string[]): Date[] {
  return isoStrings
    .map((s) => {
      try {
        return parseISO(s);
      } catch {
        return null;
      }
    })
    .filter((d): d is Date => d !== null && !Number.isNaN(d.getTime()));
}

type BookBookingSectionProps = {
  blockedDateStrings: string[];
};

export function BookBookingSection({
  blockedDateStrings,
}: BookBookingSectionProps) {
  const blockedDates = React.useMemo(
    () => parseBlocked(blockedDateStrings),
    [blockedDateStrings],
  );

  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [meetingDates, setMeetingDates] = React.useState<Date[]>([]);
  const [meetingsSnapshot, setMeetingsSnapshot] = React.useState<
    StoredMeeting[]
  >([]);

  const refreshMeetingDots = React.useCallback(() => {
    const list = loadMeetings();
    setMeetingsSnapshot(list);
    const unique = new Set<string>();
    for (const m of list) {
      unique.add(m.dateIso);
    }
    setMeetingDates(
      Array.from(unique).map((iso) =>
        startOfDay(parseISO(`${iso}T12:00:00`)),
      ),
    );
  }, []);

  React.useEffect(() => {
    refreshMeetingDots();
  }, [refreshMeetingDots]);

  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [contactOpen, setContactOpen] = React.useState(false);
  const [summaryOpen, setSummaryOpen] = React.useState(false);

  const [timePayment, setTimePayment] = React.useState<{
    startHour: string;
    endHour: string;
    payment: BookingPayload["payment"];
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
        meetingDates={meetingDates}
        dayMeetings={dayMeetings}
      />

      <BookingDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        selectedDate={selectedDate}
        onStepComplete={(payload) => {
          setTimePayment(payload);
          setContactOpen(true);
        }}
      />

      <BookingContactModal
        open={contactOpen}
        onOpenChange={setContactOpen}
        onContinue={(contact: BookingContact) => {
          if (!timePayment || !dateIso) return;
          const booking: BookingPayload = {
            ...timePayment,
            ...contact,
            dateIso,
          };
          setDraftBooking(booking);
          setContactOpen(false);
          setSummaryOpen(true);
        }}
      />

      <BookingSummaryModal
        open={summaryOpen}
        onOpenChange={setSummaryOpen}
        booking={draftBooking}
        selectedDate={selectedDate}
        onSaveMeeting={(booking) => {
          addStoredMeeting(booking);
          refreshMeetingDots();
        }}
      />
    </>
  );
}
