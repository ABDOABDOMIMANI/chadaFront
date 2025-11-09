"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ArchivedOrdersPage } from "@/components/pages/archived-orders-page"

export default function ArchivedPage() {
  return (
    <DashboardLayout>
      <ArchivedOrdersPage />
    </DashboardLayout>
  )
}

