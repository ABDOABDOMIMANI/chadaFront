"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "./sidebar"
import { TopBar } from "./top-bar"
import { useTheme } from "@/context/theme-context"
import { useAuth } from "@/hooks/use-auth"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { theme } = useTheme()
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: `var(--color-background)` }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: `var(--color-primary)` }}></div>
          <p className="mt-4" style={{ color: `var(--color-text-muted)` }}>جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: `var(--color-background)` }}>
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginRight: sidebarOpen ? "288px" : "80px" }}
      >
        <TopBar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto p-10" style={{ backgroundColor: `var(--color-background)` }}>
          {children}
        </main>
      </div>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
    </div>
  )
}
