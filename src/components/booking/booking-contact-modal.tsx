"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import type { BookingContact } from "@/lib/booking-types";
import { cn } from "@/lib/utils";

const inputClassName = cn(
  "flex h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm text-foreground",
  "ring-offset-background placeholder:text-muted-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
);

export type BookingContactModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** May return a Promise; errors should reject with Error(message). */
  onContinue: (contact: BookingContact) => void | Promise<void>;
};

export function BookingContactModal({
  open,
  onOpenChange,
  onContinue,
}: BookingContactModalProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  React.useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      setFullName("");
      setPhone("");
      setError(null);
      setPending(false);
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [open]);

  const handleDialogClose = () => {
    onOpenChange(false);
  };

  const submit = async () => {
    const name = fullName.trim();
    const tel = phone.trim();
    if (!name) {
      setError("נא למלא שם מלא.");
      return;
    }
    if (!tel || tel.replace(/\D/g, "").length < 9) {
      setError("נא למלא מספר טלפון תקין (לפחות 9 ספרות).");
      return;
    }
    setError(null);
    setPending(true);
    try {
      await onContinue({ fullName: name, phone: tel });
    } catch (e) {
      setError(e instanceof Error ? e.message : "שגיאה בשמירת ההזמנה.");
    } finally {
      setPending(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      dir="rtl"
      className={cn(
        "fixed left-1/2 top-1/2 z-[60] w-[min(100%,26rem)] max-h-[min(90vh,40rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-border/80 bg-card p-6 text-foreground shadow-xl",
        "[&::backdrop]:fixed [&::backdrop]:inset-0 [&::backdrop]:bg-foreground/20 [&::backdrop]:backdrop-blur-[2px]",
      )}
      onClose={handleDialogClose}
    >
      <div className="space-y-6">
        <header className="space-y-1 border-b border-border/50 pb-4">
          <p className="text-sm font-medium text-primary">שלב 3 מתוך 3</p>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            פרטי קשר
          </h2>
          <p className="text-sm text-muted-foreground">
            הפרטים יישמרו באירוע ביומן הגוגל של הסטודיו.
          </p>
        </header>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="booking-full-name" className="text-sm font-medium">
              שם מלא
            </label>
            <input
              id="booking-full-name"
              name="fullName"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClassName}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="booking-phone" className="text-sm font-medium">
              טלפון
            </label>
            <input
              id="booking-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClassName}
            />
          </div>
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <footer className="flex w-full flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-4">
          <Button
            type="button"
            className="rounded-2xl"
            disabled={pending}
            onClick={submit}
          >
            {pending ? "שולח…" : "אישור והזמנה"}
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
