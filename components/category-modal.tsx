"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Upload, Image as ImageIcon } from "lucide-react"

interface CategoryModalProps {
  category: any | null
  onSave: (category: any) => void
  onClose: () => void
}

export function CategoryModal({ category, onSave, onClose }: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        imageUrl: category.imageUrl || "",
      })
    } else {
      setFormData({
        name: "",
        description: "",
        imageUrl: "",
      })
    }
  }, [category])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSave(formData)
      // Modal will be closed by the parent component after successful save
    } catch (error) {
      console.error("Error saving category:", error)
      // Error is already handled in the parent component
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl"
        style={{
          backgroundColor: `var(--color-surface)`,
          border: `1px solid var(--color-border)`,
        }}
      >
        {/* Header */}
        <div
          className="flex justify-between items-center p-8 border-b"
          style={{ borderColor: `var(--color-border)` }}
        >
          <h2 className="text-3xl font-bold" style={{ color: `var(--color-primary)` }}>
            {category ? "تعديل فئة" : "إضافة فئة جديدة"}
          </h2>
          <button
            onClick={onClose}
            className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ color: `var(--color-text-muted)` }}
          >
            <X size={26} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Image Preview */}
          {formData.imageUrl && (
            <div className="flex justify-center">
              <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2" style={{ borderColor: `var(--color-border)` }}>
                <img
                  src={formData.imageUrl}
                  alt="Category preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-base font-semibold mb-3" style={{ color: `var(--color-primary)` }}>
              اسم الفئة *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 rounded-xl border transition-all focus:ring-2 focus:ring-offset-2 text-base"
              style={{
                borderColor: `var(--color-border)`,
                backgroundColor: `var(--color-background)`,
                color: `var(--color-text)`,
              }}
              placeholder="أدخل اسم الفئة"
            />
          </div>

          <div>
            <label className="block text-base font-semibold mb-3" style={{ color: `var(--color-primary)` }}>
              رابط الصورة
            </label>
            <div className="relative">
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-5 py-4 pr-14 rounded-xl border transition-all focus:ring-2 focus:ring-offset-2 text-base"
                style={{
                  borderColor: `var(--color-border)`,
                  backgroundColor: `var(--color-background)`,
                  color: `var(--color-text)`,
                }}
                placeholder="أدخل رابط الصورة"
              />
              <ImageIcon
                size={22}
                className="absolute right-5 top-1/2 transform -translate-y-1/2"
                style={{ color: `var(--color-text-muted)` }}
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold mb-3" style={{ color: `var(--color-primary)` }}>
              الوصف
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full px-5 py-4 rounded-xl border transition-all focus:ring-2 focus:ring-offset-2 resize-none text-base"
              style={{
                borderColor: `var(--color-border)`,
                backgroundColor: `var(--color-background)`,
                color: `var(--color-text)`,
              }}
              placeholder="أدخل وصف الفئة..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-6 pt-6 border-t" style={{ borderColor: `var(--color-border)` }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 hover:shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              style={{ 
                background: "linear-gradient(135deg, #fbbf24 0%, #fcd34d 100%)",
                color: "#1e40af",
                boxShadow: "0 4px 12px rgba(251, 191, 36, 0.3)",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(251, 191, 36, 0.4)"
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(251, 191, 36, 0.3)"
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                category ? "حفظ التغييرات" : "إضافة الفئة"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-8 py-4 rounded-xl font-semibold transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                border: `2px solid var(--color-border)`,
                color: `var(--color-text)`,
              }}
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
