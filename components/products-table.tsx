"use client"

import { Edit, Trash2, Eye, EyeOff, Image as ImageIcon } from "lucide-react"
import { useState } from "react"

import { API_BASE_URL, buildImageUrl } from "@/lib/api"

interface Product {
  id: number
  name: string
  price: number
  stock: number
  category: { id: number; name: string }
  imageUrl?: string
  imageUrls?: string
  volume?: number
  active: boolean
}

interface ProductsTableProps {
  products: Product[]
  loading: boolean
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
  onToggleActive: (product: Product) => void
}

export function ProductsTable({ products, loading, onEdit, onDelete, onToggleActive }: ProductsTableProps) {
  const [hoveredImage, setHoveredImage] = useState<number | null>(null)


  const getProductImage = (product: Product): string => {
    try {
      if (product.imageUrls) {
        const imageUrls = JSON.parse(product.imageUrls)
        if (Array.isArray(imageUrls) && imageUrls.length > 0) {
          return buildImageUrl(imageUrls[0])
        }
      }
      if (product.imageUrl) {
        return buildImageUrl(product.imageUrl)
      }
    } catch (e) {
      // Ignore
    }
    return "/placeholder.svg?height=64&width=64"
  }

  const getImageCount = (product: Product): number => {
    try {
      if (product.imageUrls) {
        const imageUrls = JSON.parse(product.imageUrls)
        if (Array.isArray(imageUrls)) {
          return imageUrls.length
        }
      }
      if (product.imageUrl) return 1
    } catch (e) {
      // Ignore
    }
    return 0
  }

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

  if (products.length === 0) {
    return (
      <div
        className="rounded-xl border p-12 text-center"
        style={{
          backgroundColor: `var(--color-surface)`,
          borderColor: `var(--color-border)`,
        }}
      >
        <ImageIcon size={48} className="mx-auto mb-4 opacity-30" style={{ color: `var(--color-text-muted)` }} />
        <p className="text-lg font-medium" style={{ color: `var(--color-text-muted)` }}>
          لا توجد منتجات
        </p>
        <p className="text-sm mt-2" style={{ color: `var(--color-text-muted)` }}>
          ابدأ بإضافة منتج جديد
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
              <th className="text-right py-6 px-8 font-bold text-base text-white">الصورة</th>
              <th className="text-right py-6 px-8 font-bold text-base text-white">اسم المنتج</th>
              <th className="text-right py-6 px-8 font-bold text-base text-white">السعر</th>
              <th className="text-right py-6 px-8 font-bold text-base text-white">المخزون</th>
              <th className="text-right py-6 px-8 font-bold text-base text-white">الفئة</th>
              <th className="text-right py-6 px-8 font-bold text-base text-white">السعة</th>
              <th className="text-right py-6 px-8 font-bold text-base text-white">الحالة</th>
              <th className="text-right py-6 px-8 font-bold text-base text-white">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product.id}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                style={{
                  borderColor: `var(--color-border)`,
                  opacity: product.active ? 1 : 0.6,
                }}
              >
                <td className="py-6 px-8">
                  <div
                    className="relative w-20 h-20 rounded-lg overflow-hidden border-2 group cursor-pointer"
                    style={{ borderColor: `var(--color-border)` }}
                    onMouseEnter={() => setHoveredImage(product.id)}
                    onMouseLeave={() => setHoveredImage(null)}
                  >
                    <img
                      src={getProductImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {getImageCount(product) > 1 && (
                      <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                        <ImageIcon size={12} />
                        {getImageCount(product)}
                      </div>
                    )}
                    {hoveredImage === product.id && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Eye size={20} className="text-white" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <p className="font-semibold text-sm" style={{ color: `var(--color-primary)` }}>
                      {product.name}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="font-bold text-sm" style={{ color: `#000000` }}>
                    {product.price.toFixed(2)} د.م
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={{
                      backgroundColor:
                        product.stock > 10
                          ? "rgba(34, 197, 94, 0.1)"
                          : product.stock > 0
                            ? "rgba(251, 191, 36, 0.1)"
                            : "rgba(239, 68, 68, 0.1)",
                      color:
                        product.stock > 10
                          ? "rgb(34, 197, 94)"
                          : product.stock > 0
                            ? "rgb(251, 191, 36)"
                            : "rgb(239, 68, 68)",
                    }}
                  >
                    {product.stock} قطعة
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm" style={{ color: `var(--color-text)` }}>
                    {product.category?.name || "-"}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm" style={{ color: `var(--color-text-muted)` }}>
                    {product.volume ? `${product.volume} مل` : "-"}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => onToggleActive(product)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                    style={{
                      backgroundColor: product.active ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                      color: product.active ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)",
                    }}
                  >
                    {product.active ? (
                      <>
                        <Eye size={14} />
                        نشط
                      </>
                    ) : (
                      <>
                        <EyeOff size={14} />
                        غير نشط
                      </>
                    )}
                  </button>
                </td>
                <td className="py-4 px-6">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-2 rounded-lg transition-all hover:scale-110 hover:shadow-md"
                      style={{
                        backgroundColor: `var(--color-secondary)`,
                        color: `var(--color-primary)`,
                      }}
                      title="تعديل"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="p-2 rounded-lg text-white transition-all hover:scale-110 hover:shadow-md"
                      style={{ backgroundColor: "#ef4444" }}
                      title="حذف"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
