"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardPage } from "@/components/pages/dashboard-page"

export default function Home() {
  return (
    <DashboardLayout>
      <DashboardPage />
    </DashboardLayout>
  )
}
