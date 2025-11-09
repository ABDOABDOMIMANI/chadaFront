"use client"

import { Search, Filter, X } from "lucide-react"
import { useState } from "react"

interface ProductFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  categoryFilter: number | null
  onCategoryChange: (value: number | null) => void
  categories: any[]
}

export function ProductFilters({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  categories,
}: ProductFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const selectedCategory = categories.find((cat) => cat.id === categoryFilter)

  return (
    <div
      className="rounded-xl border p-6 shadow-sm"
      style={{
        backgroundColor: `var(--color-surface)`,
        borderColor: `var(--color-border)`,
      }}
    >
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search
            size={22}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            style={{ color: `var(--color-text-muted)` }}
          />
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pr-12 pl-5 py-4 rounded-xl border transition-all focus:ring-2 focus:ring-offset-2 text-base"
            style={{
              borderColor: `var(--color-border)`,
              backgroundColor: `var(--color-background)`,
              color: `var(--color-text)`,
            }}
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={16} style={{ color: `var(--color-text-muted)` }} />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 rounded-xl border transition-all hover:scale-105 flex items-center gap-2"
            style={{
              borderColor: `var(--color-border)`,
              backgroundColor: `var(--color-background)`,
              color: `var(--color-text)`,
            }}
          >
            <Filter size={18} />
            <span className="hidden sm:inline">تصفية</span>
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {(categoryFilter || searchTerm) && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t" style={{ borderColor: `var(--color-border)` }}>
          {searchTerm && (
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium"
              style={{
                backgroundColor: `var(--color-secondary)`,
                color: `var(--color-primary)`,
              }}
            >
              البحث: {searchTerm}
              <button
                onClick={() => onSearchChange("")}
                className="hover:opacity-70 transition-opacity"
              >
                <X size={14} />
              </button>
            </span>
          )}
          {selectedCategory && (
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium"
              style={{
                backgroundColor: `var(--color-secondary)`,
                color: `var(--color-primary)`,
              }}
            >
              الفئة: {selectedCategory.name}
              <button
                onClick={() => onCategoryChange(null)}
                className="hover:opacity-70 transition-opacity"
              >
                <X size={14} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Filter Dropdown */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: `var(--color-border)` }}>
          <label className="block text-sm font-semibold mb-3" style={{ color: `var(--color-primary)` }}>
            الفئة
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCategoryChange(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !categoryFilter
                  ? "text-white"
                  : "border"
              }`}
              style={
                !categoryFilter
                  ? { backgroundColor: `var(--color-primary)` }
                  : {
                      borderColor: `var(--color-border)`,
                      color: `var(--color-text)`,
                    }
              }
            >
              الكل
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  categoryFilter === cat.id ? "text-white" : "border"
                }`}
                style={
                  categoryFilter === cat.id
                    ? { backgroundColor: `var(--color-primary)` }
                    : {
                        borderColor: `var(--color-border)`,
                        color: `var(--color-text)`,
                      }
                }
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
