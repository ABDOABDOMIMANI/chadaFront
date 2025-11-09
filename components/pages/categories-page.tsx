"use client"

import { useState, useEffect } from "react"
import { CategoriesTable } from "@/components/categories-table"
import { CategoryModal } from "@/components/category-modal"

const API_BASE_URL = "http://localhost:8080"

interface Category {
  id: number
  name: string
  description: string
  imageUrl: string
  createdAt: string
}

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`)
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCategory = async (categoryData: any) => {
    try {
      if (editingCategory) {
        await fetch(`${API_BASE_URL}/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        })
      } else {
        await fetch(`${API_BASE_URL}/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        })
      }
      fetchCategories()
      setShowModal(false)
      setEditingCategory(null)
    } catch (error) {
      console.error("Error saving category:", error)
    }
  }

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("هل تريد حذف هذه الفئة؟")) return
    try {
      await fetch(`${API_BASE_URL}/categories/${id}`, { method: "DELETE" })
      fetchCategories()
    } catch (error) {
      console.error("Error deleting category:", error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: `var(--color-primary)` }}>
            إدارة الفئات
          </h1>
          <p className="text-base" style={{ color: `var(--color-text-muted)` }}>
            إدارة فئات المنتجات وتنظيمها
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null)
            setShowModal(true)
          }}
          className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 hover:shadow-lg flex items-center gap-2"
          style={{ 
            background: "linear-gradient(135deg, #fbbf24 0%, #fcd34d 100%)",
            color: "#1e40af",
            boxShadow: "0 4px 12px rgba(251, 191, 36, 0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(251, 191, 36, 0.4)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(251, 191, 36, 0.3)"
          }}
        >
          <span className="text-xl">+</span>
          إضافة فئة جديدة
        </button>
      </div>

      <CategoriesTable
        categories={categories}
        loading={loading}
        onEdit={(category) => {
          setEditingCategory(category as Category)
          setShowModal(true)
        }}
        onDelete={handleDeleteCategory}
      />

      {showModal && (
        <CategoryModal
          category={editingCategory}
          onSave={handleSaveCategory}
          onClose={() => {
            setShowModal(false)
            setEditingCategory(null)
          }}
        />
      )}
    </div>
  )
}
