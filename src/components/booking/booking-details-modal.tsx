"use client";

import * as React from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { heLocale } from "@/lib/date-he";
import type { PaymentId } from "@/lib/booking-types";
import { PAYMENT_LABELS } from "@/lib/booking-types";
import { cn } from "@/lib/utils";

/** Hour labels (top of each hour). End may include 21:00 so a slot can finish at 21:00. */
const HOUR_BOUNDARIES = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
] as const;

function hourValue(label: string): number {
  return Number(label.slice(0, 2));
}

const PAYMENT_OPTIONS: { id: PaymentId; hint: string }[] = [
  { id: "card", hint: "תשלום מאובטח באתר" },
  { id: "bit", hint: "אישור בתוך האפליקציה" },
  { id: "cash", hint: "תשלום בעת ההגעה לסטודיו" },
];

export type BookingDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date | null;
  onStepComplete?: (payload: {
    startHour: string;
    endHour: string;
    payment: PaymentId;
  }) => void;
};

export function BookingDetailsModal({
  open,
  onOpenChange,
  selectedDate,
  onStepComplete,
}: BookingDetailsModalProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [startHour, setStartHour] = React.useState<string | null>(null);
  const [endHour, setEndHour] = React.useState<string | null>(null);
  const [payment, setPayment] = React.useState<PaymentId | null>(null);

  const startOptions = HOUR_BOUNDARIES.slice(0, -1);
  const endOptions = React.useMemo(() => {
    if (!startHour) return [];
    const minEnd = hourValue(startHour) + 1;
    return HOUR_BOUNDARIES.filter((h) => hourValue(h) >= minEnd);
  }, [startHour]);

  React.useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      setStartHour(null);
      setEndHour(null);
      setPayment(null);
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [open]);

  const handleDialogClose = () => {
    onOpenChange(false);
  };

  const dateLabel = selectedDate
    ? format(selectedDate, "EEEE, d בMMMM yyyy", { locale: heLocale })
    : null;

  const canConfirm = Boolean(
    selectedDate && startHour && endHour && payment
  );

  const confirm = () => {
    if (!canConfirm || !startHour || !endHour || !payment) return;
    onStepComplete?.({ startHour, endHour, payment });
    onOpenChange(false);
  };

  return (
    <dialog
      ref={dialogRef}
      dir="rtl"
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-[min(100%,26rem)] max-h-[min(90vh,40rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-border/80 bg-card p-6 text-foreground shadow-xl",
        "[&::backdrop]:fixed [&::backdrop]:inset-0 [&::backdrop]:bg-foreground/20 [&::backdrop]:backdrop-blur-[2px]"
      )}
      onClose={handleDialogClose}
    >
      <div className="space-y-6">
        <header className="space-y-1 border-b border-border/50 pb-4">
          <p className="text-sm font-medium text-primary">שלבים 2–3 מתוך 4</p>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            שעה ואמצעי תשלום
          </h2>
          <p className="text-sm text-muted-foreground">
            {dateLabel ? (
              <>
                <span className="font-medium text-foreground">התאריך: </span>
                {dateLabel}
              </>
            ) : (
              "נא לבחור תאריך בלוח לפני השלמת ההזמנה."
            )}
          </p>
        </header>

        <section
          className="space-y-5"
          aria-labelledby="booking-hour-heading"
        >
          <div className="space-y-1">
            <h3
              id="booking-hour-heading"
              className="text-sm font-semibold text-foreground"
            >
              טווח שעות
            </h3>
            <p className="text-xs text-muted-foreground">
              בחרו שעת התחלה ואז שעת סיום (הסיום חייב להיות אחרי ההתחלה).
            </p>
            {startHour && endHour ? (
              <p className="text-sm font-medium text-foreground">
                נבחר: {startHour} – {endHour}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              שעת התחלה
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {startOptions.map((slot) => {
                const active = startHour === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      setStartHour(slot);
                      setEndHour((prev) => {
                        if (!prev || hourValue(prev) <= hourValue(slot)) {
                          return null;
                        }
                        return prev;
                      });
                    }}
                    className={cn(
                      "rounded-2xl border px-2 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border/70 bg-background/80 hover:border-primary/40 hover:bg-accent/50"
                    )}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              שעת סיום
            </p>
            {!startHour ? (
              <p className="rounded-2xl border border-dashed border-border/70 bg-muted/15 px-3 py-3 text-center text-xs text-muted-foreground">
                קודם בחרו שעת התחלה.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {endOptions.map((slot) => {
                  const active = endHour === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setEndHour(slot)}
                      className={cn(
                        "rounded-2xl border px-2 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        active
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border/70 bg-background/80 hover:border-primary/40 hover:bg-accent/50"
                      )}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section
          className="space-y-3"
          aria-labelledby="booking-payment-heading"
        >
          <h3
            id="booking-payment-heading"
            className="text-sm font-semibold text-foreground"
          >
            אמצעי תשלום
          </h3>
          <div className="grid gap-2" role="radiogroup" aria-label="אמצעי תשלום">
            {PAYMENT_OPTIONS.map((opt) => {
              const active = payment === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setPayment(opt.id)}
                  className={cn(
                    "flex w-full flex-col items-start gap-0.5 rounded-2xl border px-4 py-3 text-start text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border/70 bg-background/80 hover:border-primary/35 hover:bg-accent/40"
                  )}
                >
                  <span className="font-medium">{PAYMENT_LABELS[opt.id]}</span>
                  <span className="text-xs text-muted-foreground">{opt.hint}</span>
                </button>
              );
            })}
          </div>
        </section>

        <footer className="flex w-full flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-4">
          <Button
            type="button"
            className="rounded-2xl"
            disabled={!canConfirm}
            onClick={confirm}
          >
            המשך לפרטי קשר
          </Button>
          <form method="dialog">
            <Button type="submit" variant="outline" className="rounded-2xl">
              ביטול
            </Button>
          </form>
        </footer>
      </div>
    </dialog>
  );
}
