"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, X, Check, Trash2, ShoppingBag } from "lucide-react"
import { useNotifications, Notification } from "@/hooks/use-notifications"
import Link from "next/link"

export function NotificationsPanel() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "الآن"
    if (minutes < 60) return `منذ ${minutes} دقيقة`
    if (hours < 24) return `منذ ${hours} ساعة`
    if (days < 7) return `منذ ${days} يوم`
    return date.toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "numeric" })
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-lg group"
        title="الإشعارات"
        style={{
          backgroundColor: `var(--color-secondary)`,
          color: `var(--color-primary)`,
          border: `2px solid var(--color-border)`,
        }}
      >
        <Bell size={20} className="group-hover:shake" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold animate-pulse shadow-lg">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-96 max-h-[600px] rounded-2xl shadow-2xl z-50 overflow-hidden"
          style={{
            backgroundColor: `var(--color-surface)`,
            border: `1px solid var(--color-border)`,
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
          }}
        >
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: `var(--color-border)` }}>
            <div className="flex items-center gap-2">
              <Bell size={20} style={{ color: `var(--color-primary)` }} />
              <h3 className="font-bold text-lg" style={{ color: `var(--color-primary)` }}>
                الإشعارات
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="تعليم الكل كمقروء"
                >
                  <Check size={16} />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-red-500"
                  title="حذف الكل"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-[500px]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={48} className="mx-auto mb-4 opacity-30" style={{ color: `var(--color-text-muted)` }} />
                <p style={{ color: `var(--color-text-muted)` }}>لا توجد إشعارات</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: `var(--color-border)` }}>
                {notifications.map((notification) => (
                  <Link
                    key={notification.id}
                    href={`/orders`}
                    onClick={() => handleNotificationClick(notification)}
                    className={`block p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          !notification.read ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <ShoppingBag
                          size={20}
                          className={!notification.read ? "text-white" : "text-gray-600 dark:text-gray-300"}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-semibold text-sm" style={{ color: `var(--color-primary)` }}>
                              طلب جديد
                            </p>
                            <p className="text-sm mt-1" style={{ color: `var(--color-text)` }}>
                              {notification.customerName}
                            </p>
                            <p className="text-xs mt-1 font-semibold" style={{ color: `#000000` }}>
                              {notification.totalAmount.toFixed(2)} د.م
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className="text-xs mt-2" style={{ color: `var(--color-text-muted)` }}>
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                        className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-500 opacity-70 hover:opacity-100"
                        title="حذف"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t text-center" style={{ borderColor: `var(--color-border)` }}>
              <Link
                href="/orders"
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold hover:underline"
                style={{ color: `var(--color-primary)` }}
              >
                عرض جميع الطلبات
              </Link>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        .shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}

