"use client"

import { useState, useEffect } from "react"
import { StatsCard } from "@/components/stats-card"
import { RecentOrders } from "@/components/recent-orders"
import { MonthlySalesChart } from "@/components/monthly-sales-chart"
import { Package, ShoppingBag, FolderOpen, AlertCircle } from "lucide-react"

import { API_BASE_URL } from "@/lib/api"

export function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCategories: 0,
    lowStockProducts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products/admin/all`),
          fetch(`${API_BASE_URL}/orders`),
          fetch(`${API_BASE_URL}/categories`),
        ])

        const products = await productsRes.json()
        const orders = await ordersRes.json()
        const categories = await categoriesRes.json()

        const lowStock = products.filter((p: any) => p.stock < 5).length

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalCategories: categories.length,
          lowStockProducts: lowStock,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-12 p-4">
      <div className="space-y-4 mb-10">
        <h1 className="text-6xl font-bold tracking-tight" style={{ color: `var(--color-primary)` }}>
          لوحة التحكم
        </h1>
        <p className="text-xl font-medium" style={{ color: `var(--color-text-muted)` }}>
          نظرة عامة شاملة على أداء متجر عطور الشدا
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <StatsCard
          title="إجمالي المنتجات"
          value={stats.totalProducts}
          icon={<ShoppingBag size={24} className="text-white" />}
          color="primary"
          subtitle="منتجات متاحة"
        />
        <StatsCard
          title="إجمالي الطلبات"
          value={stats.totalOrders}
          icon={<Package size={24} className="text-white" />}
          color="secondary"
          subtitle="جميع الطلبات"
        />
        <StatsCard
          title="الفئات"
          value={stats.totalCategories}
          icon={<FolderOpen size={24} className="text-white" />}
          color="success"
          subtitle="فئات المنتجات"
        />
        <StatsCard
          title="تنبيهات المخزون"
          value={stats.lowStockProducts}
          icon={<AlertCircle size={24} className="text-white" />}
          color="warning"
          subtitle="منتجات منخفضة"
        />
      </div>

      {/* Monthly Sales Chart Section */}
      <div>
        <MonthlySalesChart />
      </div>

      {/* Recent Orders Section */}
      <div>
        <RecentOrders />
      </div>
    </div>
  )
}
