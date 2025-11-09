"use client"

import { useState, useEffect } from "react"
import { OrdersTable } from "@/components/orders-table"

import { API_BASE_URL } from "@/lib/api"

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
}

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, statusFilter, searchTerm])

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`)
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (statusFilter) {
      filtered = filtered.filter((o) => o.status === statusFilter)
    }

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
    // Confirmation for DELIVERED status
    if (newStatus === "DELIVERED") {
      const confirmed = window.confirm(
        "هل أنت متأكد من نقل هذا الطلب إلى الأرشيف؟ سيتم تقليل المخزون من المنتجات وإزالته من قائمة الطلبات النشطة."
      )
      if (!confirmed) return
      
      try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status?status=${newStatus}`, {
          method: "PUT",
        })
        if (response.ok) {
          // Remove order from state immediately (moved to archive)
          setOrders((prev) => prev.filter((o) => o.id !== orderId))
          setFilteredOrders((prev) => prev.filter((o) => o.id !== orderId))
          alert("تم نقل الطلب إلى الأرشيف بنجاح!")
        } else {
          console.error("Failed to update order status")
          fetchOrders() // Refresh on error
        }
      } catch (error) {
        console.error("Error updating order status:", error)
        fetchOrders() // Refresh on error
      }
      return
    }

    // Confirmation for CANCELLED status - Delete from database
    if (newStatus === "CANCELLED") {
      const confirmed = window.confirm("هل أنت متأكد من إلغاء وحذف هذا الطلب نهائياً من قاعدة البيانات؟ لا يمكن التراجع عن هذا الإجراء.")
      if (!confirmed) return
      
      try {
        // First delete the order from database
        const deleteResponse = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
          method: "DELETE",
        })
        if (deleteResponse.ok) {
          // Remove order from state immediately
          setOrders((prev) => prev.filter((o) => o.id !== orderId))
          setFilteredOrders((prev) => prev.filter((o) => o.id !== orderId))
          alert("تم حذف الطلب نهائياً من قاعدة البيانات بنجاح!")
        } else {
          console.error("Failed to delete order")
          alert("فشل حذف الطلب. يرجى المحاولة مرة أخرى.")
          fetchOrders() // Refresh on error
        }
      } catch (error) {
        console.error("Error deleting order:", error)
        alert("حدث خطأ أثناء حذف الطلب. يرجى المحاولة مرة أخرى.")
        fetchOrders() // Refresh on error
      }
      return
    }

    // For other statuses, update normally
    try {
      await fetch(`${API_BASE_URL}/orders/${orderId}/status?status=${newStatus}`, {
        method: "PUT",
      })
      fetchOrders()
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const statuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: `var(--color-primary)` }}>
          إدارة الطلبات
        </h1>
        <p className="text-sm" style={{ color: `var(--color-text-muted)` }}>
          عرض وإدارة جميع طلبات العملاء
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
              placeholder="ابحث عن طلب..."
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

          <select
            value={statusFilter || ""}
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-offset-2 min-w-[180px]"
            style={{
              borderColor: `var(--color-border)`,
              backgroundColor: `var(--color-background)`,
              color: `var(--color-text)`,
            }}
          >
            <option value="">جميع الحالات</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <OrdersTable orders={filteredOrders} loading={loading} onUpdateStatus={handleUpdateStatus} />
    </div>
  )
}
