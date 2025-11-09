"use client"

import { Edit, Trash2, Image as ImageIcon } from "lucide-react"

interface Category {
  id: number
  name: string
  description: string
  imageUrl: string
}

interface CategoriesTableProps {
  categories: Category[]
  loading: boolean
  onEdit: (category: Category) => void
  onDelete: (id: number) => void
}

export function CategoriesTable({ categories, loading, onEdit, onDelete }: CategoriesTableProps) {
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

  if (categories.length === 0) {
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
          لا توجد فئات
        </p>
        <p className="text-sm mt-2" style={{ color: `var(--color-text-muted)` }}>
          ابدأ بإضافة فئة جديدة
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
              <th className="text-right py-6 px-8 font-bold text-base text-white">اسم الفئة</th>
              <th className="text-right py-6 px-8 font-bold text-base text-white">الوصف</th>
              <th className="text-right py-6 px-8 font-bold text-base text-white">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                style={{
                  borderColor: `var(--color-border)`,
                }}
              >
                <td className="py-6 px-8">
                  <p className="font-semibold text-base" style={{ color: `var(--color-primary)` }}>
                    {category.name}
                  </p>
                </td>
                <td className="py-6 px-8">
                  <p className="text-base line-clamp-2" style={{ color: `var(--color-text)` }}>
                    {category.description || "-"}
                  </p>
                </td>
                <td className="py-6 px-8">
                  <div className="flex gap-3">
                    <button
                      onClick={() => onEdit(category)}
                      className="p-3 rounded-lg transition-all hover:scale-110 hover:shadow-md flex items-center gap-2"
                      style={{
                        backgroundColor: `var(--color-secondary)`,
                        color: `var(--color-primary)`,
                      }}
                      title="تعديل"
                    >
                      <Edit size={20} />
                      <span className="text-base font-semibold">تعديل</span>
                    </button>
                    <button
                      onClick={() => onDelete(category.id)}
                      className="p-3 rounded-lg text-white transition-all hover:scale-110 hover:shadow-md flex items-center gap-2"
                      style={{ backgroundColor: "#ef4444" }}
                      title="حذف"
                    >
                      <Trash2 size={20} />
                      <span className="text-base font-semibold">حذف</span>
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
