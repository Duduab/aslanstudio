"use client";

import { DirectionProvider } from "@radix-ui/react-direction";

import { ThemeProvider } from "@/components/providers/theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="studio-rent-theme"
    >
      <DirectionProvider dir="rtl">{children}</DirectionProvider>
    </ThemeProvider>
  );
}
