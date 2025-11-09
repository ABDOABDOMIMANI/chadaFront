"use client"

import { useState, useEffect } from "react"
import { OrdersTable } from "@/components/orders-table"

const API_BASE_URL = "http://localhost:8080"

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
  updatedAt: string
  deliveryDate?: string
}

export function ArchivedOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchArchivedOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm])

  const fetchArchivedOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/archived`)
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      console.error("Error fetching archived orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(
        (o) =>
          o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.id.toString().includes(searchTerm),
      )
    }

    setFilteredOrders(filtered)
  }

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    // Archived orders should not change status, but we can allow viewing
    alert("الطلبات المؤرشفة لا يمكن تغيير حالتها.")
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "غير متوفر"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: `var(--color-primary)` }}>
          الأرشيف - الطلبات المسلمة
        </h1>
        <p className="text-sm" style={{ color: `var(--color-text-muted)` }}>
          عرض جميع الطلبات التي تم تسليمها (DELIVERED)
        </p>
      </div>

      <div
        className="p-5 rounded-xl border shadow-sm"
        style={{
          backgroundColor: `var(--color-surface)`,
          borderColor: `var(--color-border)`,
        }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="ابحث عن طلب مؤرشف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pr-10 rounded-xl border transition-all focus:ring-2 focus:ring-offset-2"
              style={{
                borderColor: `var(--color-border)`,
                backgroundColor: `var(--color-background)`,
                color: `var(--color-text)`,
              }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p style={{ color: `var(--color-text-muted)` }}>جاري تحميل الطلبات المؤرشفة...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div
          className="p-8 rounded-xl border text-center"
          style={{
            backgroundColor: `var(--color-surface)`,
            borderColor: `var(--color-border)`,
          }}
        >
          <p style={{ color: `var(--color-text-muted)` }}>لا توجد طلبات مؤرشفة حالياً</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-6 rounded-xl border shadow-sm"
              style={{
                backgroundColor: `var(--color-surface)`,
                borderColor: `var(--color-border)`,
              }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold" style={{ color: `var(--color-primary)` }}>
                      الطلب #{order.id}
                    </h3>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-semibold"
                      style={{
                        backgroundColor: "#10b981",
                        color: "white",
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span style={{ color: `var(--color-text-muted)` }}>العميل: </span>
                      <span style={{ color: `var(--color-text)` }}>{order.customerName}</span>
                    </div>
                    <div>
                      <span style={{ color: `var(--color-text-muted)` }}>البريد: </span>
                      <span style={{ color: `var(--color-text)` }}>{order.customerEmail}</span>
                    </div>
                    <div>
                      <span style={{ color: `var(--color-text-muted)` }}>الهاتف: </span>
                      <span style={{ color: `var(--color-text)` }}>{order.customerPhone}</span>
                    </div>
                    <div>
                      <span style={{ color: `var(--color-text-muted)` }}>المبلغ الإجمالي: </span>
                      <span style={{ color: `#000000`, fontWeight: "bold" }}>
                        {order.totalAmount.toFixed(2)} د.م
                      </span>
                    </div>
                    <div>
                      <span style={{ color: `var(--color-text-muted)` }}>تاريخ الطلب: </span>
                      <span style={{ color: `var(--color-text)` }}>{formatDate(order.createdAt)}</span>
                    </div>
                    <div>
                      <span style={{ color: `var(--color-text-muted)` }}>تاريخ التسليم: </span>
                      <span style={{ color: `#10b981`, fontWeight: "bold" }}>
                        {order.deliveryDate ? formatDate(order.deliveryDate) : "غير متوفر"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span style={{ color: `var(--color-text-muted)` }}>المنتجات: </span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {order.items?.map((item: any, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            backgroundColor: `var(--color-accent)`,
                            color: `#000000`,
                          }}
                        >
                          {item.product?.name || "منتج غير معروف"} x{item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

