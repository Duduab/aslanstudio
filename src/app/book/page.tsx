import type { Metadata } from "next";
import Link from "next/link";

import { BookBookingSection } from "@/components/booking/book-booking-section";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export const metadata: Metadata = {
  title: "הזמנת סטודיו — בחירת תאריך",
  description:
    "בחרו תאריך ושעה להשכרת הסטודיו. לוח בעברית, יום ראשון כתחילת השבוע.",
};

export default function BookPage() {
  return (
    <main className="min-h-dvh bg-gradient-to-b from-[#d4e4f0] via-[#e8f0f7] to-[#eef4f9] dark:from-[#08080c] dark:via-[#0f0f14] dark:to-[#15151d]">
      <header className="border-b border-white/50 bg-white/35 backdrop-blur-md dark:border-white/[0.08] dark:bg-zinc-950/55 dark:backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-sm font-medium text-neutral-600 transition hover:text-neutral-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← דף הבית
          </Link>
          <span className="text-sm font-semibold text-neutral-800 dark:text-zinc-100">
            הזמנת סטודיו
          </span>
          <ThemeToggle />
        </div>
      </header>

      <section
        id="booking"
        className="relative mx-auto max-w-6xl scroll-mt-20 px-3 py-8 sm:px-6 sm:py-14 lg:px-8"
      >
        <div className="relative mx-auto max-w-3xl space-y-8 text-center sm:space-y-10 lg:max-w-none">
          <header className="relative z-[5] space-y-3 sm:space-y-4">
            <p className="inline-flex items-center justify-center rounded-full border border-orange-200/80 bg-white/60 px-4 py-1.5 text-sm font-semibold text-[#ea580c] shadow-sm backdrop-blur-sm dark:border-orange-500/25 dark:bg-zinc-900/70 dark:text-orange-400 dark:shadow-[0_0_40px_-12px_rgba(249,115,22,0.25)]">
              שלב 1 מתוך 3
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-neutral-900 dark:text-zinc-50 sm:text-4xl">
              בחרו את מועד הצילום
            </h1>
            <p className="text-pretty text-base leading-relaxed text-neutral-600 dark:text-zinc-400 sm:text-lg">
              הלוח מוצג בעברית, עם יום ראשון כתחילת השבוע. ימים תפוסים מסומנים
              בבירור כדי למנוע טעויות.
            </p>
          </header>

          <BookBookingSection />
        </div>
      </section>
    </main>
  );
}
