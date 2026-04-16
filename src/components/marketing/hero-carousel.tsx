"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { RtlIcon } from "@/components/ui/rtl-icon";
import { cn } from "@/lib/utils";

const SLIDES = [
  {
    src: "/hero/slide-1.png",
    alt: "סטודיו צילום עם רקע אדום ותאורה מקצועית",
  },
  {
    src: "/hero/slide-2.png",
    alt: "רקע לבן אינסוף ותאורת סטודיו",
  },
  {
    src: "/hero/slide-3.png",
    alt: "חלל צילום עם רקע לבן, מצלמות ותאורה",
  },
  {
    src: "/hero/slide-4.png",
    alt: "סטודיו עם סופטבוקסים ועמדת עבודה",
  },
] as const;

const ROTATE_MS = 7000;

export function HeroCarousel() {
  const [index, setIndex] = React.useState(0);
  const count = SLIDES.length;

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [count]);

  const go = (dir: -1 | 1) => {
    setIndex((i) => (i + dir + count) % count);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="תמונות הסטודיו"
      className="relative isolate h-[min(88vh,860px)] w-full overflow-hidden bg-neutral-950"
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-out",
            i === index ? "z-0 opacity-100" : "z-0 opacity-0"
          )}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ))}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/40 to-black/25"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-48 bg-gradient-to-t from-black/70 to-transparent" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="pointer-events-auto absolute start-4 top-4 z-30 sm:start-6 sm:top-6">
          <ThemeToggle variant="overlay" />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-5 pb-28 pt-20 text-center sm:px-8 sm:pb-32 sm:pt-24">
          <div className="max-w-3xl space-y-5 sm:space-y-7">
            <p className="font-sans text-xs font-medium uppercase tracking-[0.35em] text-white/75 sm:text-sm">
              Aslan Studio · השכרת סטודיו
            </p>
            <h1 className="font-serif text-balance text-4xl font-medium leading-[1.15] tracking-tight text-white drop-shadow-sm sm:text-5xl md:text-6xl md:leading-[1.1]">
              סטודיו לשימוש מקצועי
            </h1>
            <p className="mx-auto max-w-2xl font-sans text-pretty text-base leading-relaxed text-white/88 sm:text-lg md:text-xl">
              אור יום טבעי, חלל מינימלי ושקט — בחרו תאריך ומשבצת, השאירו פרטים
              והשלימו את ההזמנה בכמה צעדים ברורים. חוויית הזמנה נקייה, מותאמת
              לעברית ול־RTL.
            </p>
          </div>

          <div className="mt-10 sm:mt-12">
            <Button
              asChild
              size="lg"
              className="pointer-events-auto rounded-full border-0 bg-primary px-12 py-7 text-base font-semibold text-primary-foreground shadow-lg shadow-black/30 transition hover:bg-primary/90 sm:text-lg"
            >
              <Link href="/book">הזמן מקום</Link>
            </Button>
          </div>
        </div>

        <div className="pointer-events-auto absolute inset-y-0 start-0 z-20 flex items-center ps-2 sm:ps-4">
          <button
            type="button"
            onClick={() => go(1)}
            className="flex size-11 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md transition hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:size-12"
            aria-label="שקופית קודמת"
          >
            <RtlIcon>
              <ChevronLeft className="size-6" />
            </RtlIcon>
          </button>
        </div>
        <div className="pointer-events-auto absolute inset-y-0 end-0 z-20 flex items-center pe-2 sm:pe-4">
          <button
            type="button"
            onClick={() => go(-1)}
            className="flex size-11 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md transition hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:size-12"
            aria-label="שקופית הבאה"
          >
            <RtlIcon>
              <ChevronRight className="size-6" />
            </RtlIcon>
          </button>
        </div>

        <div className="pointer-events-auto absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-8">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`מעבר לשקופית ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={cn(
                "h-2 rounded-full transition-all",
                i === index
                  ? "w-8 bg-white"
                  : "w-2 bg-white/45 hover:bg-white/70"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
