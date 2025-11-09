"use client"

import { ThemeProvider } from "@/context/theme-context"
import type React from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}
