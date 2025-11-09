"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const API_BASE_URL = "http://localhost:8080"

interface MonthlySalesData {
  month: string
  date?: string
  totalSales: number
  orderCount: number
}

export function MonthlySalesChart() {
  const [data, setData] = useState<MonthlySalesData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMonthlySales = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/orders/sales/monthly`)
        if (!res.ok) throw new Error("Failed to fetch monthly sales")
        const salesData = await res.json()
        // Convert BigDecimal to number for the chart
        const formattedData = salesData.map((item: any) => ({
          month: item.month || item.date,
          date: item.date,
          totalSales: parseFloat(item.totalSales),
          orderCount: item.orderCount,
        }))
        setData(formattedData)
      } catch (error) {
        console.error("Error fetching monthly sales:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMonthlySales()
  }, [])

  if (loading) {
    return (
      <div
        className="p-6 rounded-xl border shadow-lg"
        style={{
          backgroundColor: `var(--color-surface)`,
          borderColor: `var(--color-border)`,
        }}
      >
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-t-2" style={{ borderColor: `var(--color-primary)` }}></div>
          <p className="mt-4 text-sm" style={{ color: `var(--color-text-muted)` }}>
            جاري تحميل بيانات المبيعات...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="p-6 rounded-xl border shadow-lg"
      style={{
        backgroundColor: `var(--color-surface)`,
        borderColor: `var(--color-border)`,
      }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: `var(--color-primary)` }}>
          المبيعات الأسبوعية
        </h2>
        <p className="text-sm" style={{ color: `var(--color-text-muted)` }}>
          إجمالي المبيعات للطلبات المسلمة خلال آخر 7 أيام
        </p>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: `var(--color-text-muted)` }}>
            لا توجد بيانات مبيعات متاحة
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
            <XAxis
              dataKey="month"
              stroke="var(--color-text-muted)"
              style={{ fontSize: "12px", fontWeight: "500" }}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis
              yAxisId="sales"
              stroke="var(--color-text-muted)"
              style={{ fontSize: "12px" }}
              tickFormatter={(value) => {
                if (value >= 1000) return `${(value / 1000).toFixed(1)}K د.م`
                return `${value.toFixed(0)} د.م`
              }}
              label={{ value: "المبيعات (د.م)", angle: -90, position: "insideLeft", style: { fontSize: "12px", fill: "var(--color-text-muted)" } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: `var(--color-surface)`,
                border: `1px solid var(--color-border)`,
                borderRadius: "8px",
                color: `var(--color-text)`,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number, name: string) => {
                if (name === "totalSales") {
                  return [`${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} د.م`, "إجمالي المبيعات"]
                }
                return [value, "عدد الطلبات"]
              }}
              labelStyle={{ color: `var(--color-primary)`, fontWeight: "bold", marginBottom: "8px" }}
            />
            <Legend
              wrapperStyle={{ color: `var(--color-text)`, paddingTop: "20px" }}
              formatter={(value) => {
                if (value === "totalSales") return "إجمالي المبيعات"
                if (value === "orderCount") return "عدد الطلبات"
                return value
              }}
            />
            <Line
              yAxisId="sales"
              type="monotone"
              dataKey="totalSales"
              stroke="#ffc107"
              strokeWidth={3}
              dot={{ fill: "#ffc107", r: 5, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 8, stroke: "#ffc107", strokeWidth: 2 }}
              name="totalSales"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

