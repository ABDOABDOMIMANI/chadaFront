"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Lock, User, Shield, Sparkles } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if already authenticated
    const isAuthenticated = localStorage.getItem("chada_auth") === "true"
    if (isAuthenticated) {
      router.push("/")
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simple authentication
    if (username === "chada2004" && password === "chada2004") {
      localStorage.setItem("chada_auth", "true")
      localStorage.setItem("chada_username", username)
      router.push("/")
    } else {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة")
      setLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ 
        background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)"
      }}
    >
      {/* Decorative Background Elements - Blue and Yellow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-30 blur-3xl"
          style={{ backgroundColor: "#fbbf24" }}
        />
        <div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: "#2563eb" }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: "#fcd34d" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 py-8">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-6">
            <div
              className="p-5 rounded-2xl shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #fcd34d 100%)",
                boxShadow: "0 8px 32px rgba(251, 191, 36, 0.4)",
              }}
            >
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XYKl95x9EmScI2zZ0N1PsPatJylYB5.png"
                alt="عطور الشدا"
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
          <h1 
            className="text-4xl font-bold mb-3"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #fbbf24 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            عطور الشدا
          </h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield size={18} className="text-[#fbbf24]" />
            <p className="text-lg font-semibold text-white">
              تسجيل الدخول
            </p>
          </div>
          <p className="text-sm text-blue-100">
            أدخل بيانات الدخول للوصول إلى لوحة التحكم
          </p>
        </div>

        {/* Login Card */}
        <div 
          className="rounded-3xl shadow-2xl p-8 backdrop-blur-md border transition-all duration-300 hover:shadow-3xl"
          style={{ 
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            border: "2px solid rgba(251, 191, 36, 0.3)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(251, 191, 36, 0.1)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div 
                className="p-4 rounded-xl border animate-slide-down"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  borderColor: "rgba(239, 68, 68, 0.3)",
                }}
              >
                <p className="text-sm font-medium text-red-600 flex items-center gap-2">
                  <Lock size={16} />
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label 
                className="block text-sm font-bold tracking-wide uppercase" 
                style={{ color: "#1e40af" }}
              >
                اسم المستخدم
              </label>
              <div className="relative group">
                <div 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 group-focus-within:scale-110"
                  style={{ color: "#3b82f6" }}
                >
                  <User size={20} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-4 pr-12 rounded-xl border-2 transition-all duration-200 focus:outline-none"
                  style={{
                    borderColor: "#cbd5e1",
                    backgroundColor: "#ffffff",
                    color: "#1e293b",
                  }}
                  placeholder="أدخل اسم المستخدم"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6"
                    e.target.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#cbd5e1"
                    e.target.style.boxShadow = "none"
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label 
                className="block text-sm font-bold tracking-wide uppercase" 
                style={{ color: "#1e40af" }}
              >
                كلمة المرور
              </label>
              <div className="relative group">
                <div 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 group-focus-within:scale-110"
                  style={{ color: "#3b82f6" }}
                >
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-4 pr-12 rounded-xl border-2 transition-all duration-200 focus:outline-none"
                  style={{
                    borderColor: "#cbd5e1",
                    backgroundColor: "#ffffff",
                    color: "#1e293b",
                  }}
                  placeholder="أدخل كلمة المرور"
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6"
                    e.target.style.boxShadow = "0 0 0 4px rgba(59, 130, 246, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#cbd5e1"
                    e.target.style.boxShadow = "none"
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group relative overflow-hidden"
              style={{ 
                background: "linear-gradient(135deg, #fbbf24 0%, #fcd34d 100%)",
                boxShadow: "0 8px 24px rgba(251, 191, 36, 0.5)",
                color: "#1e40af",
                fontWeight: "700",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(251, 191, 36, 0.7)"
                  e.currentTarget.style.transform = "scale(1.02)"
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(251, 191, 36, 0.5)"
                e.currentTarget.style.transform = "scale(1)"
              }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#1e40af] border-t-transparent rounded-full animate-spin" />
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <Shield size={20} className="group-hover:scale-110 transition-transform duration-200" />
                  <span>تسجيل الدخول</span>
                  <Sparkles size={16} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: "#e2e8f0" }}>
            <p className="text-xs" style={{ color: "#64748b" }}>
              نظام إدارة عطور الشدا © 2025
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

