"use client"

import type React from "react"
import { TrendingUp } from "lucide-react"

interface StatsCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  color: "primary" | "secondary" | "success" | "warning"
  trend?: number
  subtitle?: string
}

const colorMap = {
  primary: {
    bg: "linear-gradient(135deg, rgba(13, 27, 42, 0.08) 0%, rgba(26, 58, 82, 0.08) 100%)",
    border: "1px solid rgba(13, 27, 42, 0.15)",
    iconBg: "linear-gradient(135deg, #0d1b2a 0%, #1a3a52 100%)",
    text: "#0d1b2a",
  },
  secondary: {
    bg: "linear-gradient(135deg, rgba(255, 193, 7, 0.08) 0%, rgba(255, 215, 64, 0.08) 100%)",
    border: "1px solid rgba(255, 193, 7, 0.15)",
    iconBg: "linear-gradient(135deg, #ffc107 0%, #ffd740 100%)",
    text: "#d97706",
  },
  success: {
    bg: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(52, 211, 153, 0.08) 100%)",
    border: "1px solid rgba(16, 185, 129, 0.15)",
    iconBg: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
    text: "#059669",
  },
  warning: {
    bg: "linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(251, 146, 60, 0.08) 100%)",
    border: "1px solid rgba(249, 115, 22, 0.15)",
    iconBg: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
    text: "#ea580c",
  },
}

export function StatsCard({ title, value, icon, color, trend, subtitle }: StatsCardProps) {
  const colors = colorMap[color]

  return (
    <div
      className="rounded-lg p-10 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
      style={{
        backgroundColor: `var(--color-surface)`,
        background: colors.bg,
        border: colors.border,
      }}
    >
      <div className="flex items-start justify-between gap-8">
        <div className="flex-1 space-y-4">
          <p className="text-base font-medium tracking-wide uppercase" style={{ color: `var(--color-text-muted)` }}>
            {title}
          </p>
          <div className="flex items-baseline gap-4">
            <p className="text-5xl font-bold leading-tight" style={{ color: colors.text }}>
              {typeof value === "number" ? value.toLocaleString("en-US") : value}
            </p>
            {trend && (
              <div className="flex items-center gap-1 text-base text-green-500 font-semibold">
                <TrendingUp size={16} />
                <span>{trend}%</span>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-base pt-3" style={{ color: `var(--color-text-muted)` }}>
              {subtitle}
            </p>
          )}
        </div>
        <div
          className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: colors.iconBg }}
        >
          <span className="text-3xl opacity-90">{icon}</span>
        </div>
      </div>
    </div>
  )
}
