"use client"
import { useTheme } from "@/context/theme-context"
import { useRouter } from "next/navigation"
import { Menu, Moon, Sun, Globe, Bell, User, LogOut } from "lucide-react"
import { NotificationsPanel } from "@/components/notifications-panel"

interface TopBarProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export function TopBar({ onToggleSidebar }: TopBarProps) {
  const { theme, toggleTheme, language, toggleLanguage } = useTheme()
  const router = useRouter()

  const handleLogout = () => {
    if (confirm("هل أنت متأكد من تسجيل الخروج؟")) {
      localStorage.removeItem("chada_auth")
      localStorage.removeItem("chada_username")
      router.push("/login")
    }
  }

  return (
    <header
      className="h-24 border-b px-8 flex items-center justify-between sticky top-0 z-40 backdrop-blur-lg"
      style={{
        backgroundColor: `var(--color-surface)`,
        borderColor: `var(--color-border)`,
        boxShadow: "0 2px 20px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="flex items-center gap-8">
        <button
          onClick={onToggleSidebar}
          className="p-4 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-lg"
          style={{
            backgroundColor: `var(--color-secondary)`,
            color: `var(--color-primary)`,
          }}
          title="Toggle Sidebar"
        >
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: `var(--color-primary)` }}>
            {language === "ar" ? "عطور الشدا" : "Chada Perfume"}
          </h1>
          <p className="text-sm mt-1" style={{ color: `var(--color-text-muted)` }}>
            {language === "ar" ? "لوحة التحكم" : "Dashboard"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Panel */}
        <NotificationsPanel />

        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="p-4 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-lg group relative"
          title={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
          style={{
            backgroundColor: `var(--color-secondary)`,
            color: `var(--color-primary)`,
            border: `2px solid var(--color-border)`,
          }}
        >
          <Globe size={22} className="group-hover:rotate-12 transition-transform duration-200" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-4 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-lg group relative"
          title={theme === "light" ? "Dark Mode" : "Light Mode"}
          style={{
            backgroundColor: `var(--color-secondary)`,
            color: `var(--color-primary)`,
            border: `2px solid var(--color-border)`,
            boxShadow: "0 4px 12px rgba(255, 193, 7, 0.2)",
          }}
        >
          {theme === "light" ? (
            <Moon size={22} className="group-hover:rotate-12 transition-transform duration-200" />
          ) : (
            <Sun size={22} className="group-hover:rotate-12 transition-transform duration-200" />
          )}
        </button>

        {/* User Profile Button */}
        <button
          className="p-4 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-lg group"
          style={{
            backgroundColor: `var(--color-secondary)`,
            color: `var(--color-primary)`,
            border: `2px solid var(--color-border)`,
          }}
          title="الملف الشخصي"
        >
          <User size={22} className="group-hover:scale-110 transition-transform duration-200" />
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-4 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-lg group"
          style={{
            backgroundColor: `var(--color-secondary)`,
            color: `#ef4444`,
            border: `2px solid var(--color-border)`,
          }}
          title="تسجيل الخروج"
        >
          <LogOut size={22} className="group-hover:scale-110 transition-transform duration-200" />
        </button>
      </div>
    </header>
  )
}
