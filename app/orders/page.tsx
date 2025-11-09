"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { OrdersPage } from "@/components/pages/orders-page"

export default function Orders() {
  return (
    <DashboardLayout>
      <OrdersPage />
    </DashboardLayout>
  )
}
