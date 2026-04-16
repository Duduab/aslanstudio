"use client";

import * as React from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { heLocale } from "@/lib/date-he";
import type { BookingPayload } from "@/lib/booking-types";
import { cn } from "@/lib/utils";

export type BookingSummaryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: BookingPayload | null;
  selectedDate: Date | null;
};

export function BookingSummaryModal({
  open,
  onOpenChange,
  booking,
  selectedDate,
}: BookingSummaryModalProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [open]);

  const handleDialogClose = () => {
    onOpenChange(false);
  };

  const dateLabel =
    selectedDate && booking
      ? format(selectedDate, "EEEE, d בMMMM yyyy", { locale: heLocale })
      : null;

  return (
    <dialog
      ref={dialogRef}
      dir="rtl"
      className={cn(
        "fixed left-1/2 top-1/2 z-[70] w-[min(100%,28rem)] max-h-[min(90vh,44rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-border/80 bg-card p-6 text-foreground shadow-xl",
        "[&::backdrop]:fixed [&::backdrop]:inset-0 [&::backdrop]:bg-foreground/20 [&::backdrop]:backdrop-blur-[2px]",
      )}
      onClose={handleDialogClose}
    >
      <div className="space-y-6">
        <header className="space-y-3 border-b border-border/50 pb-4">
          <p className="text-center text-4xl" aria-hidden>
            ✓
          </p>
          <p className="text-center text-sm font-semibold text-primary">
            הכל מוכן
          </p>
          <h2 className="text-center text-xl font-semibold tracking-tight sm:text-2xl">
            תודה רבה — ההזמנה נקלטה בהצלחה
          </h2>
          <p className="text-pretty text-center text-sm leading-relaxed text-muted-foreground">
            הקביעה נכנסה ליומן Google של הסטודיו (זהו מקור האמת לזמינות). נתראה
            בתאריך ובשעה שבחרתם. אם צריך לשנות או לבטל, צרו קשר עם הסטודיו
            בטלפון שמסרתם.
          </p>
        </header>

        {booking && dateLabel ? (
          <dl className="space-y-3 rounded-2xl border border-border/60 bg-muted/15 px-4 py-4 text-sm">
            <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
              <dt className="text-muted-foreground">שם</dt>
              <dd className="font-medium">{booking.fullName}</dd>
            </div>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
              <dt className="text-muted-foreground">טלפון</dt>
              <dd className="font-medium">{booking.phone}</dd>
            </div>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
              <dt className="text-muted-foreground">תאריך</dt>
              <dd className="font-medium">{dateLabel}</dd>
            </div>
            <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
              <dt className="text-muted-foreground">שעות</dt>
              <dd className="font-medium">
                {booking.startHour} – {booking.endHour}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-muted-foreground">אין נתוני הזמנה להצגה.</p>
        )}

        <footer className="flex w-full flex-wrap items-center justify-center border-t border-border/50 pt-4">
          <form method="dialog">
            <Button type="submit" size="lg" className="rounded-2xl px-8">
              סגירה
            </Button>
          </form>
        </footer>
      </div>
    </dialog>
  );
}
