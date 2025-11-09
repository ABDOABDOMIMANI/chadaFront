"use client"

interface OrderStatusBadgeProps {
  status: string
}

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: "#ffc107", text: "#000", label: "قيد الانتظار" },
  CONFIRMED: { bg: "#2196f3", text: "#fff", label: "مؤكد" },
  SHIPPED: { bg: "#ff9800", text: "#fff", label: "مرسل" },
  DELIVERED: { bg: "#4caf50", text: "#fff", label: "تم التسليم" },
  CANCELLED: { bg: "#f44336", text: "#fff", label: "ملغي" },
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusColors[status] || statusColors.PENDING

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-semibold"
      style={{
        backgroundColor: config.bg,
        color: config.text,
      }}
    >
      {config.label}
    </span>
  )
}
