"use client"

import { useState, useEffect } from "react"
import { ProductsTable } from "@/components/products-table"
import { ProductModal } from "@/components/product-modal"
import { ProductFilters } from "@/components/product-filters"

import { API_BASE_URL } from "@/lib/api"

interface Product {
  id: number
  name: string
  description: string
  category: { id: number; name: string }
  imageUrl?: string
  imageUrls?: string
  imageDetails?: string
  fragrance?: string
  volume?: number
  active: boolean
  createdAt?: string
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, categoryFilter])

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/admin/all`)
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`)
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const filterProducts = () => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter) {
      filtered = filtered.filter((p) => p.category.id === categoryFilter)
    }

    setFilteredProducts(filtered)
  }

  const handleSaveProduct = async (productData: any) => {
    try {
      // The modal handles the actual save with images
      // This is just a callback
      fetchProducts()
      setShowModal(false)
      setEditingProduct(null)
    } catch (error) {
      console.log("Error saving product:", error)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج نهائياً من قاعدة البيانات؟ لا يمكن التراجع عن هذا الإجراء.")) return
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, { 
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      if (response.ok) {
        try {
          const result = await response.json()
          // Remove product from state immediately
          setProducts((prev) => prev.filter((p) => p.id !== id))
          setFilteredProducts((prev) => prev.filter((p) => p.id !== id))
          alert("تم حذف المنتج من قاعدة البيانات بنجاح!")
        } catch (parseError) {
          // If response is not JSON (shouldn't happen, but handle it)
          console.warn("Response was OK but not JSON:", parseError)
          setProducts((prev) => prev.filter((p) => p.id !== id))
          setFilteredProducts((prev) => prev.filter((p) => p.id !== id))
          alert("تم حذف المنتج من قاعدة البيانات بنجاح!")
        }
      } else {
        let errorText = "يرجى المحاولة مرة أخرى"
        try {
          errorText = await response.text()
        } catch (e) {
          console.error("Could not read error response:", e)
        }
        console.error("Failed to delete product:", response.status, errorText)
        alert(`فشل حذف المنتج: ${errorText}`)
        fetchProducts() // Refresh on error
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      alert(`حدث خطأ أثناء حذف المنتج: ${error instanceof Error ? error.message : "يرجى المحاولة مرة أخرى"}`)
      fetchProducts() // Refresh on error
    }
  }

  const handleToggleActive = async (product: Product) => {
    try {
      await fetch(`${API_BASE_URL}/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, active: !product.active }),
      })
      fetchProducts()
    } catch (error) {
      console.error("Error toggling product active status:", error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: `var(--color-primary)` }}>
            إدارة المنتجات
          </h1>
          <p className="text-base" style={{ color: `var(--color-text-muted)` }}>
            إدارة وإضافة المنتجات مع دعم حتى 4 صور لكل منتج
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null)
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
          إضافة منتج جديد
        </button>
      </div>

      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        categories={categories}
      />

      <ProductsTable
        products={filteredProducts}
        loading={loading}
        onEdit={(product) => {
          setEditingProduct(product as Product)
          setShowModal(true)
        }}
        onDelete={handleDeleteProduct}
        onToggleActive={(product) => handleToggleActive(product as Product)}
      />

      {showModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowModal(false)
            setEditingProduct(null)
          }}
        />
      )}
    </div>
  )
}
