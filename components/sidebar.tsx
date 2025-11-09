"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingBag, Layers, Archive } from "lucide-react"

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

export function Sidebar({ open }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { label: "لوحة التحكم", href: "/", icon: LayoutDashboard },
    { label: "المنتجات", href: "/products", icon: Package },
    { label: "الطلبات", href: "/orders", icon: ShoppingBag },
    { label: "الأرشيف", href: "/archived", icon: Archive },
    { label: "الفئات", href: "/categories", icon: Layers },
  ]

  return (
    <aside
      className={`transition-all duration-300 border-l flex flex-col h-screen fixed right-0 top-0 z-30 ${
        open ? "w-72" : "w-20"
      }`}
      style={{
        backgroundColor: `var(--color-primary)`,
        borderColor: `var(--color-border)`,
        boxShadow: "-2px 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="p-8 flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center justify-center mb-10 group cursor-pointer">
          <div
            className="p-5 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #ffc107, #ffd740)",
              boxShadow: "0 4px 15px rgba(255, 193, 7, 0.3)",
            }}
          >
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XYKl95x9EmScI2zZ0N1PsPatJylYB5.png"
              alt="عطور الشدا"
              className="w-12 h-12 object-contain"
            />
          </div>
          {open && (
            <div className="ml-4 animate-fade-in">
              <p className="font-bold text-white text-xl leading-tight">عطور</p>
              <p className="font-bold text-yellow-400 text-xl">الشدا</p>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-7 py-6 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? "shadow-lg scale-105"
                    : "hover:scale-105"
                }`}
                style={{
                  backgroundColor: isActive ? "#ffc107" : "transparent",
                  color: isActive ? "#0d1b2a" : "#e2e8f0",
                }}
                title={item.label}
              >
                {/* Active indicator */}
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-12 rounded-r-full"
                    style={{ backgroundColor: "#0d1b2a" }}
                  />
                )}
                
                {open && (
                  <span
                    className="ml-5 text-lg font-bold transition-all duration-200"
                    style={{
                      color: isActive ? "#0d1b2a" : "#e2e8f0",
                    }}
                  >
                    {item.label}
                  </span>
                )}
                
                <div
                  className={`flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10"
                      : "group-hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-8 h-8 flex-shrink-0" />
                </div>
                
                {/* Hover tooltip when closed */}
                {!open && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    {item.label}
                    <div className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2">
                      <div className="border-4 border-transparent border-l-gray-900"></div>
                    </div>
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        {open && (
          <div
            className="p-6 rounded-xl text-center border mt-6"
            style={{
              borderColor: `rgba(255, 255, 255, 0.1)`,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            }}
          >
            <p className="text-sm text-gray-300 font-medium">نظام إدارة عطور الشدا</p>
            <p className="text-yellow-400 mt-2 text-sm font-bold">v1.0</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </aside>
  )
}
