"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { he } from "date-fns/locale";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RtlIcon } from "@/components/ui/rtl-icon";
import { PAYMENT_LABELS } from "@/lib/booking-types";
import type { StoredMeeting } from "@/lib/meetings-storage";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS_HE = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"] as const;

type BookingCalendarProps = {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onRequestDetails?: () => void;
  blockedDates?: Date[];
  meetingDates?: Date[];
  dayMeetings?: StoredMeeting[];
};

export function BookingCalendar({
  selectedDate,
  onSelectDate,
  onRequestDetails,
  blockedDates = [],
  meetingDates = [],
  dayMeetings = [],
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(() =>
    selectedDate ? startOfMonth(selectedDate) : startOfMonth(new Date()),
  );

  React.useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(startOfMonth(selectedDate));
    }
  }, [selectedDate]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const isBlocked = (d: Date) =>
    blockedDates.some((b) => isSameDay(b, d));

  const hasMeeting = (d: Date) =>
    meetingDates.some((m) => isSameDay(m, d));

  const goPrevMonth = () => setCurrentMonth((m) => subMonths(m, 1));
  const goNextMonth = () => setCurrentMonth((m) => addMonths(m, 1));
  const goToday = () => {
    const t = new Date();
    setCurrentMonth(startOfMonth(t));
    if (!isBlocked(t)) onSelectDate(t);
  };

  const monthTitle = format(currentMonth, "LLLL yyyy", { locale: he });

  const navBtnClass =
    "size-9 shrink-0 rounded-full border shadow-sm sm:size-10 border-neutral-200/90 bg-white/80 text-neutral-800 hover:bg-white dark:border-white/12 dark:bg-zinc-800/75 dark:text-zinc-100 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_8px_28px_-12px_rgba(0,0,0,0.65)] dark:hover:bg-zinc-700/85";

  return (
    <Card
      dir="rtl"
      className={cn(
        "overflow-hidden rounded-[1.75rem] border backdrop-blur-2xl sm:rounded-[2rem]",
        "border-white/70 bg-white/60 shadow-[0_28px_90px_-24px_rgba(15,23,42,0.28)] supports-[backdrop-filter]:bg-white/55",
        "dark:border-white/[0.09] dark:bg-zinc-900/50 dark:shadow-[0_36px_100px_-24px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.06)] dark:supports-[backdrop-filter]:bg-zinc-900/45",
      )}
    >
      <CardHeader
        className={cn(
          "space-y-1 border-b px-4 pb-3 pt-5 sm:px-6 sm:pb-4 sm:pt-6",
          "border-white/40 dark:border-white/[0.08]",
        )}
      >
        <div className="relative flex min-h-10 items-center justify-between gap-2 sm:min-h-11">
          <div className="z-[1] flex items-center gap-1.5 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={goPrevMonth}
              className={navBtnClass}
              aria-label="חודש קודם"
            >
              <RtlIcon>
                <ChevronRight className="size-4" />
              </RtlIcon>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={goNextMonth}
              className={navBtnClass}
              aria-label="חודש הבא"
            >
              <RtlIcon>
                <ChevronLeft className="size-4" />
              </RtlIcon>
            </Button>
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center gap-1 px-16 sm:px-20">
            <CardTitle className="truncate text-center text-sm font-bold uppercase tracking-[0.1em] text-neutral-800 dark:text-zinc-50 sm:text-base sm:tracking-[0.12em]">
              {monthTitle}
            </CardTitle>
            <ChevronDown
              className="size-3.5 shrink-0 text-neutral-500 opacity-70 dark:text-zinc-400 sm:size-4"
              aria-hidden
            />
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={goToday}
            className="z-[1] h-9 shrink-0 rounded-full px-2.5 text-xs font-bold uppercase tracking-wider text-[#ea580c] hover:bg-orange-500/10 hover:text-[#c2410c] dark:text-zinc-100 dark:hover:bg-white/10 dark:hover:text-white sm:h-10 sm:px-4 sm:text-sm"
          >
            היום
          </Button>
        </div>
        <CardDescription className="text-center text-xs text-neutral-500 dark:text-zinc-400 sm:text-sm">
          בחרו יום פנוי. לאחר מכן ייפתח חלון לבחירת שעות ותשלום.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-0 px-3 pb-2 pt-3 sm:px-5 sm:pb-3 sm:pt-4">
        <div
          className="grid grid-cols-7 gap-y-1 text-center text-[0.65rem] font-bold uppercase tracking-wide text-[#f97316] dark:text-[#fb923c] sm:gap-y-0.5 sm:text-xs sm:tracking-wider"
          aria-hidden
        >
          {WEEKDAY_LABELS_HE.map((label) => (
            <div key={label} className="py-2 sm:py-2.5">
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-x-1 gap-y-1.5 pb-1 sm:gap-x-1.5 sm:gap-y-2">
          {days.map((day) => {
            const inMonth = isSameMonth(day, currentMonth);
            const blocked = isBlocked(day);
            const selected = selectedDate && isSameDay(day, selectedDate);
            const today = isToday(day);
            const meeting = hasMeeting(day);
            const futureOrToday =
              !isBefore(day, new Date()) || isSameDay(day, new Date());

            return (
              <button
                key={day.toISOString()}
                type="button"
                disabled={blocked || !inMonth || !futureOrToday}
                onClick={() => onSelectDate(day)}
                className={cn(
                  "relative flex min-h-[2.65rem] flex-col items-center justify-center rounded-xl border text-sm font-medium transition-all duration-150 sm:min-h-[3rem] sm:text-[0.95rem]",
                  !inMonth &&
                    "pointer-events-none border-transparent bg-transparent text-neutral-400 opacity-60 dark:text-zinc-600 dark:opacity-80",
                  inMonth &&
                    !blocked &&
                    futureOrToday &&
                    !selected &&
                    "border-transparent bg-transparent text-neutral-900 hover:bg-orange-500/[0.08] dark:text-zinc-50 dark:hover:bg-orange-500/[0.12]",
                  inMonth &&
                    blocked &&
                    "cursor-not-allowed border-transparent bg-neutral-100/40 text-neutral-400 line-through decoration-neutral-400 dark:bg-white/[0.06] dark:text-zinc-600 dark:decoration-zinc-600",
                  inMonth &&
                    !futureOrToday &&
                    !blocked &&
                    "pointer-events-none border-transparent text-neutral-300 dark:text-zinc-600",
                  selected &&
                    "z-[1] scale-[1.02] border-transparent font-semibold text-white shadow-[0_10px_28px_-6px_rgba(249,115,22,0.55)] dark:shadow-[0_14px_40px_-8px_rgba(255,138,0,0.45)]",
                  selected &&
                    "bg-gradient-to-br from-[#fb923c] via-[#f97316] to-[#e11d48] hover:from-[#fdba74] hover:via-[#fb923c] hover:to-[#f43f5e] dark:bg-gradient-to-b dark:from-[#ff8a00] dark:via-[#ff6a18] dark:to-[#ff3d00] dark:hover:from-[#ffb04a] dark:hover:via-[#ff7a22] dark:hover:to-[#ff4d18]",
                  today &&
                    !selected &&
                    inMonth &&
                    futureOrToday &&
                    !blocked &&
                    "ring-2 ring-[#f97316] ring-offset-2 ring-offset-white/60 dark:ring-[#fb923c] dark:ring-offset-zinc-900/90",
                )}
              >
                <span>{format(day, "d")}</span>
                {meeting && (
                  <span
                    className={cn(
                      "absolute bottom-1 size-1.5 rounded-full sm:bottom-1.5 sm:size-2",
                      selected ? "bg-white/90" : "bg-orange-500 dark:bg-orange-300",
                    )}
                    aria-hidden
                  />
                )}
              </button>
            );
          })}
        </div>
      </CardContent>

      <section
        aria-labelledby="calendar-day-meetings-heading"
        className={cn(
          "border-t px-3 py-4 backdrop-blur-md sm:px-5 sm:py-5",
          "border-white/40 bg-white/[0.18] dark:border-white/[0.08] dark:bg-zinc-950/35",
        )}
      >
        <h3
          id="calendar-day-meetings-heading"
          className="mb-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-[#ea580c] dark:text-[#fb923c] sm:text-start sm:text-sm sm:tracking-[0.12em]"
        >
          פגישות ביום הנבחר
        </h3>

        {!selectedDate ? (
          <p
            className={cn(
              "rounded-2xl border px-3 py-3 text-center text-xs sm:px-4 sm:text-sm",
              "border-orange-200/40 bg-gradient-to-l from-orange-500/[0.07] to-white/25 text-neutral-600",
              "dark:border-orange-500/20 dark:from-orange-500/15 dark:to-zinc-900/50 dark:text-zinc-400",
            )}
          >
            לחצו על יום בלוח כדי לראות כאן את הפגישות השמורות במכשיר זה.
          </p>
        ) : dayMeetings.length === 0 ? (
          <p
            className={cn(
              "rounded-2xl border px-3 py-3 text-center text-xs sm:px-4 sm:text-sm",
              "border-white/50 bg-white/35 text-neutral-600",
              "dark:border-white/10 dark:bg-zinc-900/55 dark:text-zinc-400",
            )}
          >
            אין פגישות שמורות ל־
            <span className="font-semibold text-neutral-800 dark:text-zinc-200">
              {format(selectedDate, "d בMMMM yyyy", { locale: he })}
            </span>
            .
          </p>
        ) : (
          <ul className="flex max-h-[min(40vh,16rem)] flex-col gap-2 overflow-y-auto overscroll-y-contain sm:max-h-60">
            {dayMeetings.map((m) => (
              <li
                key={m.id}
                className={cn(
                  "rounded-2xl border p-3 backdrop-blur-sm sm:p-3.5",
                  "border-orange-200/45 bg-gradient-to-l from-orange-500/12 via-white/35 to-white/20 shadow-[0_8px_24px_-12px_rgba(234,88,12,0.25)]",
                  "dark:border-orange-500/25 dark:from-orange-500/18 dark:via-zinc-800/55 dark:to-zinc-900/45 dark:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.55)]",
                )}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                  <div className="min-w-0 space-y-1 text-start">
                    <p className="truncate text-sm font-semibold text-neutral-900 dark:text-zinc-50">
                      {m.fullName}
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-zinc-400 sm:text-sm">
                      <span className="font-medium text-[#c2410c] dark:text-orange-300">
                        {m.startHour} – {m.endHour}
                      </span>
                      <span className="text-neutral-400 dark:text-zinc-600">
                        {" "}
                        ·{" "}
                      </span>
                      <span>{PAYMENT_LABELS[m.payment]}</span>
                    </p>
                  </div>
                  <div className="shrink-0 text-start text-[0.65rem] leading-snug text-neutral-500 dark:text-zinc-500 sm:text-end sm:text-xs">
                    <p className="truncate sm:max-w-[10rem]">{m.phone}</p>
                    <p className="truncate sm:max-w-[10rem]">{m.email}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <CardFooter
        className={cn(
          "flex flex-col gap-3 border-t px-4 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5",
          "border-white/40 bg-white/25 dark:border-white/[0.08] dark:bg-zinc-950/40",
        )}
      >
        <div
          className={cn(
            "w-full rounded-2xl border px-3 py-2.5 text-center sm:w-auto sm:text-start sm:px-4",
            "border-orange-200/50 bg-gradient-to-l from-orange-500/10 to-transparent",
            "dark:border-orange-500/20 dark:from-orange-500/12 dark:to-transparent",
          )}
        >
          <p className="text-xs font-medium text-neutral-600 dark:text-zinc-400 sm:text-sm">
            {selectedDate ? (
              <>
                נבחר:{" "}
                <span className="font-semibold text-neutral-900 dark:text-zinc-100">
                  {format(selectedDate, "EEEE, d בMMMM yyyy", { locale: he })}
                </span>
              </>
            ) : (
              "לא נבחר יום — לחצו על תאריך בלוח"
            )}
          </p>
        </div>
        <Button
          type="button"
          className="w-full rounded-full bg-gradient-to-l from-[#f97316] to-[#ea580c] px-6 font-semibold text-white shadow-[0_12px_32px_-8px_rgba(234,88,12,0.45)] hover:from-[#fb923c] hover:to-[#f97316] dark:from-[#ff8a00] dark:to-[#ff4d00] dark:shadow-[0_16px_40px_-10px_rgba(255,106,0,0.4)] dark:hover:from-[#ffb04a] dark:hover:to-[#ff6a18] sm:w-auto"
          disabled={!selectedDate}
          onClick={() => {
            if (selectedDate) onRequestDetails?.();
          }}
        >
          המשך לפרטים ותשלום
        </Button>
      </CardFooter>
    </Card>
  );
}
