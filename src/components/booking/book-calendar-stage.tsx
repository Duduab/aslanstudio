"use client";

import Image from "next/image";
import * as React from "react";

type BookCalendarStageProps = {
  children: React.ReactNode;
};

export function BookCalendarStage({ children }: BookCalendarStageProps) {
  return (
    <div className="relative mx-auto w-full max-w-[min(100%,42rem)] py-4 sm:max-w-3xl sm:py-8 lg:max-w-4xl">
      {/* Desktop — light decor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-visible max-sm:hidden dark:hidden"
      >
        <Image
          src="/book-decor/cube.png"
          alt=""
          width={220}
          height={220}
          className="absolute -start-[8%] top-[6%] z-0 w-[min(28vw,220px)] max-w-none opacity-95 drop-shadow-2xl sm:-start-[12%] sm:top-[4%] lg:w-[240px]"
        />
        <Image
          src="/book-decor/torus.png"
          alt=""
          width={200}
          height={200}
          className="absolute -end-[6%] -top-[2%] z-0 w-[min(26vw,200px)] max-w-none opacity-95 drop-shadow-2xl sm:-end-[10%] lg:w-[220px]"
        />
        <Image
          src="/book-decor/sphere.png"
          alt=""
          width={180}
          height={180}
          className="absolute -end-[4%] bottom-[18%] z-0 w-[min(24vw,180px)] max-w-none opacity-95 drop-shadow-2xl sm:bottom-[12%] lg:bottom-[8%] lg:w-[200px]"
        />
      </div>

      {/* Desktop — dark decor (Figma-style props) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden overflow-visible max-sm:hidden dark:block"
      >
        <Image
          src="/book-decor/cube-dark.png"
          alt=""
          width={220}
          height={220}
          className="absolute -start-[8%] top-[6%] z-0 w-[min(28vw,220px)] max-w-none opacity-[0.92] drop-shadow-[0_28px_60px_-12px_rgba(249,115,22,0.35)] sm:-start-[12%] sm:top-[4%] lg:w-[240px]"
        />
        <Image
          src="/book-decor/torus-dark.png"
          alt=""
          width={200}
          height={200}
          className="absolute -end-[6%] -top-[2%] z-0 w-[min(26vw,200px)] max-w-none opacity-90 drop-shadow-2xl sm:-end-[10%] lg:w-[220px]"
        />
        <Image
          src="/book-decor/sphere-dark.png"
          alt=""
          width={180}
          height={180}
          className="absolute -end-[4%] bottom-[18%] z-0 w-[min(24vw,180px)] max-w-none opacity-[0.95] drop-shadow-[0_24px_50px_-10px_rgba(234,88,12,0.45)] sm:bottom-[12%] lg:bottom-[8%] lg:w-[200px]"
        />
      </div>

      {/* Mobile — light */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 sm:hidden dark:hidden"
      >
        <Image
          src="/book-decor/cube.png"
          alt=""
          width={100}
          height={100}
          className="absolute -start-6 top-0 w-24 opacity-80 drop-shadow-xl"
        />
        <Image
          src="/book-decor/sphere.png"
          alt=""
          width={90}
          height={90}
          className="absolute -end-4 bottom-1/4 w-20 opacity-80 drop-shadow-xl"
        />
      </div>

      {/* Mobile — dark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden dark:block sm:hidden"
      >
        <Image
          src="/book-decor/cube-dark.png"
          alt=""
          width={100}
          height={100}
          className="absolute -start-6 top-0 w-24 opacity-75 drop-shadow-xl"
        />
        <Image
          src="/book-decor/sphere-dark.png"
          alt=""
          width={90}
          height={90}
          className="absolute -end-4 bottom-1/4 w-20 opacity-85 drop-shadow-lg"
        />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  );
}
