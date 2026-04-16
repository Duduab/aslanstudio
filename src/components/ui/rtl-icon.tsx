import * as React from "react";

import { cn } from "@/lib/utils";

type RtlIconProps = {
  children: React.ReactNode;
  className?: string;
  /** When true, mirrors horizontally so directional icons match RTL motion. */
  flip?: boolean;
};

export function RtlIcon({ children, className, flip = true }: RtlIconProps) {
  return (
    <span
      className={cn(
        "inline-flex size-[1em] items-center justify-center",
        flip && "[transform:scaleX(-1)]",
        className
      )}
    >
      {children}
    </span>
  );
}
