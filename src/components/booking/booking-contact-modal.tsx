"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import type { BookingContact } from "@/lib/booking-types";
import { cn } from "@/lib/utils";

const inputClassName = cn(
  "flex h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm text-foreground",
  "ring-offset-background placeholder:text-muted-foreground",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
);

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export type BookingContactModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: (contact: BookingContact) => void;
};

export function BookingContactModal({
  open,
  onOpenChange,
  onContinue,
}: BookingContactModalProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      setFullName("");
      setEmail("");
      setPhone("");
      setError(null);
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [open]);

  const handleDialogClose = () => {
    onOpenChange(false);
  };

  const submit = () => {
    const name = fullName.trim();
    const mail = email.trim();
    const tel = phone.trim();
    if (!name) {
      setError("נא למלא שם מלא.");
      return;
    }
    if (!mail || !isValidEmail(mail)) {
      setError("נא למלא כתובת דוא״ל תקינה.");
      return;
    }
    if (!tel || tel.replace(/\D/g, "").length < 9) {
      setError("נא למלא מספר טלפון תקין (לפחות 9 ספרות).");
      return;
    }
    setError(null);
    onContinue({ fullName: name, email: mail, phone: tel });
  };

  return (
    <dialog
      ref={dialogRef}
      dir="rtl"
      className={cn(
        "fixed left-1/2 top-1/2 z-[60] w-[min(100%,26rem)] max-h-[min(90vh,40rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl border border-border/80 bg-card p-6 text-foreground shadow-xl",
        "[&::backdrop]:fixed [&::backdrop]:inset-0 [&::backdrop]:bg-foreground/20 [&::backdrop]:backdrop-blur-[2px]"
      )}
      onClose={handleDialogClose}
    >
      <div className="space-y-6">
        <header className="space-y-1 border-b border-border/50 pb-4">
          <p className="text-sm font-medium text-primary">שלב 4 מתוך 4</p>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            פרטי קשר
          </h2>
          <p className="text-sm text-muted-foreground">
            נא למלא פרטים ליצירת קשר ואישור ההזמנה.
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
            <label htmlFor="booking-email" className="text-sm font-medium">
              דוא״ל
            </label>
            <input
              id="booking-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            onClick={submit}
          >
            המשך
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
