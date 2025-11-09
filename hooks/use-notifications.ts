import { useState, useEffect, useCallback } from "react"

const API_BASE_URL = "http://localhost:8080"

export interface Notification {
  id: number
  orderId: number
  customerName: string
  totalAmount: number
  createdAt: string
  read: boolean
  type: "order"
}

const NOTIFICATIONS_STORAGE_KEY = "chada_notifications"
const LAST_ORDER_ID_KEY = "chada_last_order_id"

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Load notifications from localStorage on mount
  useEffect(() => {
    loadNotifications()
  }, [])

  // Load notifications from localStorage
  const loadNotifications = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          const sorted = parsed.sort((a: Notification, b: Notification) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          setNotifications(sorted)
          setUnreadCount(sorted.filter((n: Notification) => !n.read).length)
        }
      } catch (error) {
        console.error("Error loading notifications:", error)
      }
    }
  }, [])

  // Save notifications to localStorage
  const saveNotifications = useCallback((newNotifications: Notification[]) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(newNotifications))
        setNotifications(newNotifications)
        setUnreadCount(newNotifications.filter((n) => !n.read).length)
      } catch (error) {
        console.error("Error saving notifications:", error)
      }
    }
  }, [])

  // Check for new orders
  const checkForNewOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`)
      if (!res.ok) throw new Error("Failed to fetch orders")
      const orders = await res.json()

      if (orders.length === 0) return

      // Get last known order ID
      const lastOrderId = typeof window !== "undefined"
        ? parseInt(localStorage.getItem(LAST_ORDER_ID_KEY) || "0")
        : 0

      // Find new orders
      const newOrders = orders
        .filter((order: any) => order.id > lastOrderId)
        .sort((a: any, b: any) => b.id - a.id)

      if (newOrders.length > 0) {
        // Update last order ID
        if (typeof window !== "undefined") {
          localStorage.setItem(LAST_ORDER_ID_KEY, newOrders[0].id.toString())
        }

        // Create notifications for new orders
        const newNotifications: Notification[] = newOrders.map((order: any) => ({
          id: Date.now() + order.id, // Unique ID
          orderId: order.id,
          customerName: order.customerName,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt,
          read: false,
          type: "order" as const,
        }))

        // Add new notifications to existing ones
        const existingNotifications = loadNotificationsFromStorage()
        
        // Merge and remove duplicates based on orderId
        const existingOrderIds = new Set(existingNotifications.map((n: Notification) => n.orderId))
        const uniqueNewNotifications = newNotifications.filter(
          (n: Notification) => !existingOrderIds.has(n.orderId)
        )
        
        if (uniqueNewNotifications.length > 0) {
          const updatedNotifications = [...uniqueNewNotifications, ...existingNotifications]
          // Keep only last 50 notifications
          const trimmedNotifications = updatedNotifications.slice(0, 50)
          // Sort by date (newest first)
          const sorted = trimmedNotifications.sort((a: Notification, b: Notification) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          saveNotifications(sorted)
        }
      }
    } catch (error) {
      console.error("Error checking for new orders:", error)
    }
  }, [saveNotifications])

  // Load notifications from storage
  const loadNotificationsFromStorage = (): Notification[] => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
      } catch {
        return []
      }
    }
    return []
  }

  // Mark notification as read
  const markAsRead = useCallback((notificationId: number) => {
    const updated = notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    )
    saveNotifications(updated)
  }, [notifications, saveNotifications])

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    const updated = notifications.map((n) => ({ ...n, read: true }))
    saveNotifications(updated)
  }, [notifications, saveNotifications])

  // Delete notification
  const deleteNotification = useCallback((notificationId: number) => {
    const updated = notifications.filter((n) => n.id !== notificationId)
    saveNotifications(updated)
  }, [notifications, saveNotifications])

  // Clear all notifications
  const clearAll = useCallback(() => {
    saveNotifications([])
    if (typeof window !== "undefined") {
      localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY)
    }
  }, [saveNotifications])

  // Poll for new orders every 5 seconds
  useEffect(() => {
    // Initial check after 1 second
    const initialTimeout = setTimeout(() => {
      checkForNewOrders()
    }, 1000)

    // Then check every 5 seconds
    const interval = setInterval(() => {
      checkForNewOrders()
    }, 5000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    checkForNewOrders,
  }
}

