"use client"

import React, { useState } from "react"
import { OrderStatusBadge } from "./order-status-badge"
import { ChevronDown, Package, Search } from "lucide-react"

interface Order {
  id: number
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  totalAmount: number
  status: string
  items: any[]
  createdAt: string
}

interface OrdersTableProps {
  orders: Order[]
  loading: boolean
  onUpdateStatus: (orderId: number, status: string) => void
}

export function OrdersTable({ orders, loading, onUpdateStatus }: OrdersTableProps) {
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null)

  const statuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]

  if (loading) {
    return (
      <div
        className="rounded-xl border p-12 text-center"
        style={{
          backgroundColor: `var(--color-surface)`,
          borderColor: `var(--color-border)`,
        }}
      >
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-t-2" style={{ borderColor: `var(--color-primary)` }}></div>
        <p className="mt-4" style={{ color: `var(--color-text-muted)` }}>
          جاري التحميل...
        </p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div
        className="rounded-xl border p-12 text-center"
        style={{
          backgroundColor: `var(--color-surface)`,
          borderColor: `var(--color-border)`,
        }}
      >
        <Package size={48} className="mx-auto mb-4 opacity-30" style={{ color: `var(--color-text-muted)` }} />
        <p className="text-lg font-medium" style={{ color: `var(--color-text-muted)` }}>
          لا توجد طلبات
        </p>
        <p className="text-sm mt-2" style={{ color: `var(--color-text-muted)` }}>
          سيتم عرض الطلبات هنا عند استلامها
        </p>
      </div>
    )
  }

  return (
    <div
      className="rounded-xl border overflow-hidden shadow-lg"
      style={{
        backgroundColor: `var(--color-surface)`,
        borderColor: `var(--color-border)`,
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              className="border-b"
              style={{
                borderColor: `var(--color-border)`,
                backgroundColor: `var(--color-primary)`,
              }}
            >
              <th className="text-right py-6 px-8 font-bold text-base text-white">رقم الطلب</th>
              <th className="text-right py-6 px-8 font-bold text-base text-white">العميل</th>
              <th className="text-right py-6 px-8 font-bold text-base text-white">البريد الإلكتروني</th>
              <th className="text-right py-6 px-8 font-bold text-base text-white">المبلغ</th>
              <th className="text-right py-6 px-8 font-bold text-base text-white">الحالة</th>
              <th className="text-right py-6 px-8 font-bold text-base text-white">التاريخ</th>
              <th className="text-right py-6 px-8 font-bold text-base text-white">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  style={{
                    borderColor: `var(--color-border)`,
                  }}
                >
                  <td className="py-6 px-8">
                    <span className="font-bold text-base" style={{ color: `var(--color-primary)` }}>
                      #{order.id}
                    </span>
                  </td>
                  <td className="py-6 px-8">
                    <p className="font-semibold text-base" style={{ color: `var(--color-text)` }}>
                      {order.customerName}
                    </p>
                  </td>
                  <td className="py-6 px-8">
                    <p className="text-base" style={{ color: `var(--color-text-muted)` }}>
                      {order.customerEmail}
                    </p>
                  </td>
                  <td className="py-6 px-8">
                    <span className="font-bold text-xl" style={{ color: `#000000` }}>
                      {order.totalAmount.toFixed(2)} د.م
                    </span>
                  </td>
                  <td className="py-6 px-8">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="py-6 px-8">
                    <p className="text-base" style={{ color: `var(--color-text)` }}>
                      {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </td>
                  <td className="py-6 px-8">
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="p-3 rounded-lg transition-all hover:scale-110 hover:shadow-md"
                      style={{
                        backgroundColor: `var(--color-secondary)`,
                        color: `var(--color-primary)`,
                      }}
                      title="عرض التفاصيل"
                    >
                      <ChevronDown
                        size={22}
                        style={{
                          transform: expandedOrder === order.id ? "rotate(-180deg)" : "rotate(0deg)",
                          transition: "transform 0.3s",
                        }}
                      />
                    </button>
                  </td>
                </tr>

                {expandedOrder === order.id && (
                  <tr
                    className="border-b"
                    style={{
                      borderColor: `var(--color-border)`,
                      backgroundColor: `var(--color-background)`,
                    }}
                  >
                    <td colSpan={7} className="py-6 px-6">
                      <div className="space-y-6">
                        {/* Customer Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-4 rounded-xl" style={{ backgroundColor: `var(--color-surface)` }}>
                            <p
                              className="text-xs font-semibold uppercase mb-2"
                              style={{ color: `var(--color-text-muted)` }}
                            >
                              الهاتف
                            </p>
                            <p className="font-semibold text-sm" style={{ color: `var(--color-text)` }}>
                              {order.customerPhone}
                            </p>
                          </div>
                          <div className="p-4 rounded-xl" style={{ backgroundColor: `var(--color-surface)` }}>
                            <p
                              className="text-xs font-semibold uppercase mb-2"
                              style={{ color: `var(--color-text-muted)` }}
                            >
                              العنوان
                            </p>
                            <p className="font-semibold text-sm" style={{ color: `var(--color-text)` }}>
                              {order.customerAddress}
                            </p>
                          </div>
                        </div>

                        {/* Status Update */}
                        <div>
                          <p
                            className="text-sm font-semibold mb-4"
                            style={{ color: `var(--color-primary)` }}
                          >
                            تحديث الحالة
                          </p>
                          <div className="flex gap-3 flex-wrap">
                            {statuses.map((status) => (
                              <button
                                key={status}
                                onClick={() => onUpdateStatus(order.id, status)}
                                className={`px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105 hover:shadow-md ${
                                  order.status === status ? "ring-2 ring-offset-2" : ""
                                }`}
                                style={{
                                  backgroundColor:
                                    order.status === status
                                      ? `var(--color-secondary)`
                                      : `var(--color-background)`,
                                  color: order.status === status ? `var(--color-primary)` : `var(--color-text)`,
                                  border: `2px solid ${order.status === status ? `var(--color-primary)` : `var(--color-border)`}`,
                                  ringColor: `var(--color-accent)`,
                                }}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Order Items */}
                        <div>
                          <p
                            className="text-sm font-semibold mb-4"
                            style={{ color: `var(--color-primary)` }}
                          >
                            المنتجات ({order.items.length})
                          </p>
                          <div className="space-y-3">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between items-center p-4 rounded-xl"
                                style={{ backgroundColor: `var(--color-surface)`, border: `1px solid var(--color-border)` }}
                              >
                                <div>
                                  <p className="font-semibold text-sm" style={{ color: `var(--color-text)` }}>
                                    {item.product?.name || "منتج محذوف"}
                                  </p>
                                  <p className="text-xs mt-1" style={{ color: `var(--color-text-muted)` }}>
                                    الكمية: {item.quantity} × <span style={{ color: `#000000`, fontWeight: "bold" }}>{item.price?.toFixed(2) || "0.00"} د.م</span>
                                  </p>
                                </div>
                                <span className="font-bold text-lg" style={{ color: `#000000` }}>
                                  {((item.price || 0) * (item.quantity || 0)).toFixed(2)} د.م
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
