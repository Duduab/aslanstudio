"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  /** `overlay` — glass button on dark hero; `default` — header / light surfaces */
  variant?: "default" | "overlay";
  className?: string;
};

export function ThemeToggle({
  variant = "default",
  className,
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      disabled={!mounted}
      aria-label={isDark ? "מעבר למצב בהיר" : "מעבר למצב כהה"}
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40",
        variant === "overlay" &&
          "border-white/30 bg-black/40 text-amber-100 shadow-lg shadow-black/30 backdrop-blur-md hover:bg-black/55 focus-visible:ring-white/60 focus-visible:ring-offset-transparent",
        variant === "default" &&
          "border-neutral-200/90 bg-white/80 text-neutral-800 shadow-sm backdrop-blur-sm hover:bg-white focus-visible:ring-orange-400/80 focus-visible:ring-offset-background dark:border-white/12 dark:bg-zinc-800/85 dark:text-zinc-100 dark:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] dark:hover:bg-zinc-700/90 dark:focus-visible:ring-orange-400/50",
        className,
      )}
    >
      {!mounted ? (
        <span className="size-5" aria-hidden />
      ) : isDark ? (
        <Sun className="size-[1.15rem]" strokeWidth={2} aria-hidden />
      ) : (
        <Moon className="size-[1.05rem]" strokeWidth={2} aria-hidden />
      )}
    </button>
  );
}
