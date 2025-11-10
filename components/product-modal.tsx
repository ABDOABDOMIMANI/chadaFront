"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { X, Upload, Image as ImageIcon, Trash2, Eye, Percent, Calendar } from "lucide-react"

import { API_BASE_URL, buildImageUrl } from "@/lib/api"

interface ProductModalProps {
  product: any | null
  categories: any[]
  onSave: (product: any) => void
  onClose: () => void
}

export function ProductModal({ product, categories, onSave, onClose }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    fragrance: "",
    volume: "",
    active: true,
    discountPercentage: "",
    promotionStartDate: "",
    promotionEndDate: "",
    promotionDays: "",
  })

  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [imageDetails, setImageDetails] = useState<Array<{ price?: string; description?: string; quantity?: string }>>([])
  const [viewingImage, setViewingImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        category: product.category?.id || "",
        fragrance: product.fragrance || "",
        volume: product.volume || "",
        active: product.active !== undefined ? product.active : true,
        discountPercentage: product.discountPercentage?.toString() || "",
        promotionStartDate: product.promotionStartDate || "",
        promotionEndDate: product.promotionEndDate || "",
        promotionDays: product.promotionDays || "",
      })


      // Load existing images and image details
      if (product.imageDetails) {
        try {
          const parsed = JSON.parse(product.imageDetails)
          if (Array.isArray(parsed)) {
            setExistingImages(parsed.map((img: any) => img.url || img))
            setImagePreviews(parsed.map((img: any) => {
              const url = img.url || img
              return buildImageUrl(url)
            }))
            setImageDetails(parsed.map((img: any) => ({
              price: img.price?.toString() || "",
              description: img.description || "",
              quantity: img.quantity?.toString() || "",
            })))
          }
        } catch (e) {
          console.error("Error parsing imageDetails:", e)
        }
      } else if (product.imageUrls) {
        try {
          const parsed = JSON.parse(product.imageUrls)
          if (Array.isArray(parsed)) {
            setExistingImages(parsed)
            setImagePreviews(parsed.map((url: string) => buildImageUrl(url)))
            setImageDetails(parsed.map(() => ({ price: "", description: "", quantity: "" })))
          }
        } catch (e) {
          console.error("Error parsing imageUrls:", e)
        }
      } else if (product.imageUrl) {
        const url = buildImageUrl(product.imageUrl)
        setExistingImages([product.imageUrl])
        setImagePreviews([url])
        setImageDetails([{ price: "", description: "", quantity: "" }])
      }
    } else {
      // Reset for new product
      setFormData({
        name: "",
        description: "",
        category: "",
        fragrance: "",
        volume: "",
        active: true,
        discountPercentage: "",
        promotionStartDate: "",
        promotionEndDate: "",
        promotionDays: "",
      })
      setImages([])
      setImagePreviews([])
      setExistingImages([])
      setImageDetails([])
    }
  }, [product])

  // Note: Price calculation removed since price is now per-image

  // Calculate end date when promotion days changes
  useEffect(() => {
    if (formData.promotionDays && formData.promotionStartDate) {
      const startDate = new Date(formData.promotionStartDate)
      const days = parseInt(formData.promotionDays)
      if (!isNaN(days) && days > 0) {
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + days)
        setFormData((prev) => ({
          ...prev,
          promotionEndDate: endDate.toISOString().split("T")[0],
        }))
      }
    }
  }, [formData.promotionDays, formData.promotionStartDate])

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const remainingSlots = 4 - imagePreviews.length
    const filesToAdd = files.slice(0, remainingSlots)

    filesToAdd.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string])
        setImages((prev) => [...prev, file])
        setImageDetails((prev) => [...prev, { price: "", description: "", quantity: "" }])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImageDetails((prev) => prev.filter((_, i) => i !== index))
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  const updateImageDetail = (index: number, field: "price" | "description" | "quantity", value: string) => {
    setImageDetails((prev) => {
      const updated = [...prev]
      if (!updated[index]) {
        updated[index] = { price: "", description: "", quantity: "" }
      }
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate that at least one image has price and quantity
      if (imagePreviews.length === 0) {
        alert("يجب إضافة صورة واحدة على الأقل للمنتج")
        setIsSubmitting(false)
        return
      }

      // Validate that all images have price and quantity
      for (let i = 0; i < imagePreviews.length; i++) {
        const detail = imageDetails[i] || {}
        if (!detail.price || detail.price.trim() === "" || parseFloat(detail.price) <= 0) {
          alert(`يجب إدخال سعر صحيح للصورة ${i + 1}`)
          setIsSubmitting(false)
          return
        }
        if (!detail.quantity || detail.quantity.trim() === "" || parseInt(detail.quantity) < 0) {
          alert(`يجب إدخال كمية صحيحة للصورة ${i + 1}`)
          setIsSubmitting(false)
          return
        }
      }

      const discount = formData.discountPercentage ? parseFloat(formData.discountPercentage) : 0
      
      const productData: any = {
        name: formData.name,
        description: formData.description,
        category: { id: Number.parseInt(formData.category) },
        fragrance: formData.fragrance,
        volume: formData.volume ? Number.parseInt(formData.volume) : null,
        active: formData.active,
        // Price and stock are removed - they come from imageDetails only
      }

      // Handle promotion pricing (applies to all images via discountPercentage)
      if (discount > 0 && discount <= 100) {
        productData.discountPercentage = Math.round(discount)
        // Add promotion dates
        if (formData.promotionStartDate) {
          productData.promotionStartDate = formData.promotionStartDate
        }
        if (formData.promotionEndDate) {
          productData.promotionEndDate = formData.promotionEndDate
        }
      } else {
        productData.discountPercentage = null
        productData.originalPrice = null
        productData.promotionStartDate = null
        productData.promotionEndDate = null
      }

      // Helper function to extract URL from full path
      const extractUrl = (fullUrl: string): string => {
        if (fullUrl.startsWith("http")) return fullUrl
        if (fullUrl.startsWith("/api/images/")) return fullUrl.replace("/api/images/", "")
        if (fullUrl.includes("/api/images/")) return fullUrl.split("/api/images/").pop() || fullUrl
        return fullUrl
      }

      // Prepare image details array for existing images
      const prepareImageDetails = (urls: string[]): any[] => {
        return urls.map((url, index) => {
          const detail = imageDetails[index] || { price: "", description: "", quantity: "" }
          const cleanUrl = extractUrl(url)
          return {
            url: cleanUrl,
            price: detail.price ? parseFloat(detail.price) : null,
            description: detail.description || null,
            quantity: detail.quantity ? parseInt(detail.quantity) : null,
          }
        })
      }

      // If there are new images, upload them
      if (images.length > 0) {
        const formDataToSend = new FormData()
        formDataToSend.append("product", JSON.stringify(productData))
        images.forEach((image) => {
          formDataToSend.append("images", image)
        })

        const endpoint = product
          ? `${API_BASE_URL}/products/${product.id}/with-images`
          : `${API_BASE_URL}/products/with-images`
        const method = product ? "PUT" : "POST"

        const res = await fetch(endpoint, {
          method,
          body: formDataToSend,
        })

        if (!res.ok) throw new Error("Failed to save product with images")
        const savedProduct = await res.json()
        
        // After upload, update imageDetails with actual URLs and save
        const uploadedImageUrls = savedProduct.imageUrls ? JSON.parse(savedProduct.imageUrls) : []
        
        // Build final image details array based on uploaded URLs
        // Match imageDetails array with uploadedImageUrls array
        const finalImageDetails = uploadedImageUrls.map((url: string, index: number) => {
          const detail = imageDetails[index] || { price: "", description: "", quantity: "" }
          return {
            url: extractUrl(url),
            price: detail.price ? parseFloat(detail.price) : null,
            description: detail.description || null,
            quantity: detail.quantity ? parseInt(detail.quantity) : null,
          }
        })
        
        // Update product with image details
        // Remove price and stock from savedProduct if they exist (legacy fields)
        const { price, stock, ...productWithoutPriceStock } = savedProduct as any
        const updateData = {
          ...productWithoutPriceStock,
          imageDetails: JSON.stringify(finalImageDetails),
        }
        const updateRes = await fetch(`${API_BASE_URL}/products/${savedProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        })
        if (updateRes.ok) {
          const updatedProduct = await updateRes.json()
          onSave(updatedProduct)
        } else {
          onSave(savedProduct)
        }
      } else {
        // No new images, save normally via API
        if (product) {
          // Update existing product - preserve images and add image details
          const allImageDetails = prepareImageDetails(existingImages)
          // Remove price and stock from product if they exist (legacy fields)
          const { price, stock, ...productWithoutPriceStock } = product as any
          const updateData = {
            ...productData,
            imageUrl: product.imageUrl,
            imageUrls: product.imageUrls,
            imageDetails: imagePreviews.length > 0 ? JSON.stringify(allImageDetails) : product.imageDetails,
          }
          const res = await fetch(`${API_BASE_URL}/products/${product.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updateData),
          })
          if (!res.ok) throw new Error("Failed to update product")
          onSave(await res.json())
        } else {
          // Create new product
          const res = await fetch(`${API_BASE_URL}/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
          })
          if (!res.ok) throw new Error("Failed to create product")
          onSave(await res.json())
        }
      }
    } catch (error) {
      console.error("Error saving product:", error)
      alert("حدث خطأ أثناء حفظ المنتج")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getImageUrl = (url: string) => {
    return buildImageUrl(url) || ""
  }

  return (
    <>
      {/* Image Viewer Modal */}
      {viewingImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
          onClick={() => setViewingImage(null)}
        >
          <button
            onClick={() => setViewingImage(null)}
            className="absolute top-4 left-4 text-white hover:text-gray-300 transition-colors"
          >
            <X size={32} />
          </button>
          <img
            src={viewingImage}
            alt="Preview"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Main Modal */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div
          className="w-full max-w-4xl rounded-2xl shadow-2xl my-8"
          style={{
            backgroundColor: `var(--color-surface)`,
            border: `1px solid var(--color-border)`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex justify-between items-center p-8 border-b"
            style={{ borderColor: `var(--color-border)` }}
          >
            <h2 className="text-3xl font-bold" style={{ color: `var(--color-primary)` }}>
              {product ? "تعديل منتج" : "إضافة منتج جديد"}
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
          <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Images Section */}
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: `var(--color-primary)` }}>
                صور المنتج (حتى 4 صور)
              </label>
              <div className="space-y-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="border rounded-xl p-4" style={{ borderColor: `var(--color-border)`, backgroundColor: `var(--color-background)` }}>
                    <div className="flex gap-4">
                      <div className="relative group flex-shrink-0">
                        <div
                          className="relative aspect-square w-20 rounded-lg overflow-hidden border-2"
                          style={{ borderColor: `var(--color-border)` }}
                        >
                          <img
                            src={preview}
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setViewingImage(preview)}
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 left-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <Trash2 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setViewingImage(preview)}
                            className="absolute top-1 right-1 p-1 bg-blue-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600"
                          >
                            <Eye size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold mb-1" style={{ color: `var(--color-primary)` }}>
                            سعر الصورة (د.م) *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            required
                            value={imageDetails[index]?.price || ""}
                            onChange={(e) => updateImageDetail(index, "price", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border text-sm transition-all focus:ring-2 focus:ring-offset-2"
                            style={{
                              borderColor: `var(--color-border)`,
                              backgroundColor: `var(--color-background)`,
                              color: `var(--color-text)`,
                            }}
                            placeholder="السعر الخاص بهذه الصورة"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: `var(--color-primary)` }}>
                            وصف الصورة - اختياري
                          </label>
                          <textarea
                            value={imageDetails[index]?.description || ""}
                            onChange={(e) => updateImageDetail(index, "description", e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg border text-base transition-all focus:ring-2 focus:ring-offset-2 resize-none"
                            style={{
                              borderColor: `var(--color-border)`,
                              backgroundColor: `var(--color-background)`,
                              color: `var(--color-text)`,
                            }}
                            placeholder="وصف خاص بهذه الصورة"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: `var(--color-primary)` }}>
                            الكمية *
                          </label>
                          <input
                            type="number"
                            min="0"
                            required
                            value={imageDetails[index]?.quantity || ""}
                            onChange={(e) => updateImageDetail(index, "quantity", e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border text-base transition-all focus:ring-2 focus:ring-offset-2"
                            style={{
                              borderColor: `var(--color-border)`,
                              backgroundColor: `var(--color-background)`,
                              color: `var(--color-text)`,
                            }}
                            placeholder="الكمية الخاصة بهذه الصورة"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {imagePreviews.length < 4 && (
                  <label
                    className="relative w-20 h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-solid transition-all group"
                    style={{
                      borderColor: `var(--color-border)`,
                      backgroundColor: `var(--color-background)`,
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <Upload size={20} className="mb-1" style={{ color: `var(--color-text-muted)` }} />
                    <span className="text-[10px] text-center px-1" style={{ color: `var(--color-text-muted)` }}>
                      إضافة
                    </span>
                  </label>
                )}
              </div>
              {imagePreviews.length === 0 && (
                <p className="text-xs mt-2" style={{ color: `var(--color-text-muted)` }}>
                  يمكنك إضافة حتى 4 صور للمنتج
                </p>
              )}
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-semibold mb-3" style={{ color: `var(--color-primary)` }}>
                  اسم المنتج *
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
                  placeholder="أدخل اسم المنتج"
                />
              </div>

              <div>
                <label className="block text-base font-semibold mb-3" style={{ color: `var(--color-primary)` }}>
                  الفئة *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 rounded-xl border transition-all focus:ring-2 focus:ring-offset-2 text-base"
                  style={{
                    borderColor: `var(--color-border)`,
                    backgroundColor: `var(--color-background)`,
                    color: `var(--color-text)`,
                  }}
                >
                  <option value="">اختر فئة</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>


              <div>
                <label className="block text-base font-semibold mb-3" style={{ color: `var(--color-primary)` }}>
                  العطر
                </label>
                <input
                  type="text"
                  name="fragrance"
                  value={formData.fragrance}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-xl border transition-all focus:ring-2 focus:ring-offset-2 text-base"
                  style={{
                    borderColor: `var(--color-border)`,
                    backgroundColor: `var(--color-background)`,
                    color: `var(--color-text)`,
                  }}
                  placeholder="نوع العطر"
                />
              </div>

              <div>
                <label className="block text-base font-semibold mb-3" style={{ color: `var(--color-primary)` }}>
                  السعة (مل)
                </label>
                <input
                  type="number"
                  name="volume"
                  value={formData.volume}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-5 py-4 rounded-xl border transition-all focus:ring-2 focus:ring-offset-2 text-base"
                  style={{
                    borderColor: `var(--color-border)`,
                    backgroundColor: `var(--color-background)`,
                    color: `var(--color-text)`,
                  }}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Promotion Section */}
            <div className="p-4 rounded-xl border" style={{ borderColor: `var(--color-border)`, backgroundColor: `var(--color-background)` }}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: `var(--color-primary)` }}>
                <Percent size={20} />
                الترويج / الخصم
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-semibold mb-3" style={{ color: `var(--color-primary)` }}>
                    نسبة الخصم (%)
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="1"
                    className="w-full px-5 py-4 rounded-xl border transition-all focus:ring-2 focus:ring-offset-2 text-base"
                    style={{
                      borderColor: `var(--color-border)`,
                      backgroundColor: `var(--color-background)`,
                      color: `var(--color-text)`,
                    }}
                    placeholder="0"
                  />
                  {formData.discountPercentage && parseFloat(formData.discountPercentage) > 0 && (
                    <p className="text-xs mt-2" style={{ color: `var(--color-text-muted)` }}>
                      سيتم تطبيق الخصم على جميع صور المنتج
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-base font-semibold mb-3" style={{ color: `var(--color-primary)` }}>
                    مدة الترويج (أيام)
                  </label>
                  <input
                    type="number"
                    name="promotionDays"
                    value={formData.promotionDays}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-5 py-4 rounded-xl border transition-all focus:ring-2 focus:ring-offset-2 text-base"
                    style={{
                      borderColor: `var(--color-border)`,
                      backgroundColor: `var(--color-background)`,
                      color: `var(--color-text)`,
                    }}
                    placeholder="عدد الأيام"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: `var(--color-primary)` }}>
                    <Calendar size={16} />
                    تاريخ البدء
                  </label>
                  <input
                    type="date"
                    name="promotionStartDate"
                    value={formData.promotionStartDate}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl border transition-all focus:ring-2 focus:ring-offset-2 text-base"
                    style={{
                      borderColor: `var(--color-border)`,
                      backgroundColor: `var(--color-background)`,
                      color: `var(--color-text)`,
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: `var(--color-primary)` }}>
                    <Calendar size={16} />
                    تاريخ الانتهاء
                  </label>
                  <input
                    type="date"
                    name="promotionEndDate"
                    value={formData.promotionEndDate}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl border transition-all focus:ring-2 focus:ring-offset-2 text-base"
                    style={{
                      borderColor: `var(--color-border)`,
                      backgroundColor: `var(--color-background)`,
                      color: `var(--color-text)`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: `var(--color-primary)` }}>
                الوصف
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border transition-all focus:ring-2 focus:ring-offset-2 resize-none"
                style={{
                  borderColor: `var(--color-border)`,
                  backgroundColor: `var(--color-background)`,
                  color: `var(--color-text)`,
                }}
                placeholder="أدخل وصف المنتج..."
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: `var(--color-background)` }}>
              <input
                type="checkbox"
                name="active"
                id="active"
                checked={formData.active}
                onChange={handleChange}
                className="w-5 h-5 rounded cursor-pointer"
                style={{ accentColor: `var(--color-accent)` }}
              />
              <label htmlFor="active" className="text-sm font-medium cursor-pointer" style={{ color: `var(--color-text)` }}>
                المنتج نشط ومتاح للبيع
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t" style={{ borderColor: `var(--color-border)` }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
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
                  product ? "حفظ التغييرات" : "إضافة المنتج"
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
    </>
  )
}
