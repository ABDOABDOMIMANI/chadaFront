"use client"

import { useState, useEffect } from "react"
import { OrderStatusBadge } from "./order-status-badge"
import { Package, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { API_BASE_URL } from "@/lib/api"

interface Order {
  id: number
  customerName: string
  customerEmail: string
  totalAmount: number
  status: string
  createdAt: string
}

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/orders`)
        const data = await res.json()
        setOrders(data.slice(0, 5))
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div
      className="p-6 rounded-xl border shadow-lg"
      style={{
        backgroundColor: `var(--color-surface)`,
        borderColor: `var(--color-border)`,
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold" style={{ color: `var(--color-primary)` }}>
          آخر الطلبات
        </h2>
        <Link
          href="/orders"
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105"
          style={{
            backgroundColor: `var(--color-secondary)`,
            color: `var(--color-primary)`,
          }}
        >
          <span className="text-sm font-semibold">عرض الكل</span>
          <ArrowLeft size={16} />
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-t-2" style={{ borderColor: `var(--color-primary)` }}></div>
          <p className="mt-4 text-sm" style={{ color: `var(--color-text-muted)` }}>
            جاري التحميل...
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto mb-4 opacity-30" style={{ color: `var(--color-text-muted)` }} />
          <p className="text-sm" style={{ color: `var(--color-text-muted)` }}>
            لا توجد طلبات حديثة
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="border-b"
                style={{
                  borderColor: `var(--color-border)`,
                }}
              >
                <th className="text-right py-4 px-4 font-semibold" style={{ color: `var(--color-text-muted)` }}>
                  رقم الطلب
                </th>
                <th className="text-right py-4 px-4 font-semibold" style={{ color: `var(--color-text-muted)` }}>
                  العميل
                </th>
                <th className="text-right py-4 px-4 font-semibold" style={{ color: `var(--color-text-muted)` }}>
                  المبلغ
                </th>
                <th className="text-right py-4 px-4 font-semibold" style={{ color: `var(--color-text-muted)` }}>
                  الحالة
                </th>
                <th className="text-right py-4 px-4 font-semibold" style={{ color: `var(--color-text-muted)` }}>
                  التاريخ
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  style={{
                    borderColor: `var(--color-border)`,
                  }}
                >
                  <td className="py-4 px-4">
                    <span className="font-bold" style={{ color: `var(--color-primary)` }}>
                      #{order.id}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium" style={{ color: `var(--color-text)` }}>
                      {order.customerName}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold" style={{ color: `#000000` }}>
                      {order.totalAmount.toFixed(2)} د.م
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm" style={{ color: `var(--color-text-muted)` }}>
                      {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
