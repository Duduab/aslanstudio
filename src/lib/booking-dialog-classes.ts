import { cn } from "@/lib/utils";

type BookingDialogOpts = {
  maxW?: string;
  maxH?: string;
  z?: string;
};

/**
 * Center `<dialog>` in the viewport on mobile + RTL.
 * Uses inset + margin:auto instead of left-50% + translate (breaks inside transformed/filtered ancestors).
 */
export function bookingDialogClassName(opts: BookingDialogOpts = {}) {
  const {
    maxW = "max-w-[26rem]",
    maxH = "max-h-[min(92dvh,40rem)]",
    z = "z-50",
  } = opts;
  return cn(
    "fixed inset-3 m-auto box-border flex h-fit w-full flex-col overflow-y-auto overflow-x-hidden sm:inset-6",
    z,
    maxW,
    maxH,
    "rounded-3xl border border-border/80 bg-card p-6 text-foreground shadow-xl",
    "[&::backdrop]:fixed [&::backdrop]:inset-0 [&::backdrop]:bg-foreground/20 [&::backdrop]:backdrop-blur-[2px]",
  );
}
