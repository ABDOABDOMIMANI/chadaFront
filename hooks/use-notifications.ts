import { useState, useEffect, useCallback, useMemo } from "react"

import { API_BASE_URL } from "@/lib/api"
import { useWebSocket, OrderNotification as WSOrderNotification } from "./use-websocket"

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
          // Sort by createdAt (newest first) - most recent at top
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

  // Save notifications to localStorage (always sorted by newest first)
  const saveNotifications = useCallback((newNotifications: Notification[]) => {
    if (typeof window !== "undefined") {
      try {
        // Always sort by createdAt (newest first) before saving
        const sorted = [...newNotifications].sort((a: Notification, b: Notification) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(sorted))
        setNotifications(sorted)
        setUnreadCount(sorted.filter((n) => !n.read).length)
      } catch (error) {
        console.error("Error saving notifications:", error)
      }
    }
  }, [])

  // Load notifications from storage
  const loadNotificationsFromStorage = useCallback((): Notification[] => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
      } catch {
        return []
      }
    }
    return []
  }, [])

  // Check for new orders
  const checkForNewOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        credentials: "omit",
        cache: "no-cache",
      })
      
      if (!res.ok) {
        console.error("Failed to fetch orders:", res.status, res.statusText)
        // Try to get error message
        try {
          const errorText = await res.text()
          console.error("Error response:", errorText)
        } catch (e) {
          // Ignore
        }
        return
      }
      
      const orders = await res.json()
      
      if (!orders) {
        console.warn("Orders API returned null or undefined")
        return
      }

      if (!Array.isArray(orders) || orders.length === 0) {
        // If no orders exist, initialize lastOrderId to 0
        if (typeof window !== "undefined" && !localStorage.getItem(LAST_ORDER_ID_KEY)) {
          localStorage.setItem(LAST_ORDER_ID_KEY, "0")
        }
        return
      }

      // Get last known order ID (initialize to 0 if not set)
      let lastOrderId = 0
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(LAST_ORDER_ID_KEY)
        if (stored) {
          lastOrderId = parseInt(stored, 10) || 0
        } else {
          // First time - set to the highest existing order ID to avoid creating notifications for old orders
          const maxOrderId = Math.max(...orders.map((o: any) => o.id || 0))
          localStorage.setItem(LAST_ORDER_ID_KEY, maxOrderId.toString())
          lastOrderId = maxOrderId
        }
      }

      // Find new orders (only orders created after the last known order)
      const newOrders = orders
        .filter((order: any) => order.id && order.id > lastOrderId)
        .sort((a: any, b: any) => b.id - a.id)

      if (newOrders.length > 0) {
        console.log(`Found ${newOrders.length} new order(s)`)
        
        // Update last order ID to the highest new order ID
        const maxNewOrderId = Math.max(...newOrders.map((o: any) => o.id))
        if (typeof window !== "undefined") {
          localStorage.setItem(LAST_ORDER_ID_KEY, maxNewOrderId.toString())
        }

        // Create notifications for new orders
        const newNotifications: Notification[] = newOrders.map((order: any) => ({
          id: Date.now() + order.id + Math.random(), // Unique ID
          orderId: order.id,
          customerName: order.customerName || "عميل",
          totalAmount: order.totalAmount || 0,
          createdAt: order.createdAt || new Date().toISOString(),
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
          console.log(`Adding ${uniqueNewNotifications.length} new notification(s)`)
          // Add new notifications at the beginning (they're already newest)
          const updatedNotifications = [...uniqueNewNotifications, ...existingNotifications]
          // Keep only last 50 notifications (saveNotifications will sort by newest first)
          const trimmedNotifications = updatedNotifications.slice(0, 50)
          saveNotifications(trimmedNotifications)
          
          // Trigger browser notification if supported
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            newOrders.forEach((order: any) => {
              new Notification("طلب جديد", {
                body: `طلب جديد من ${order.customerName || "عميل"} - ${order.totalAmount || 0} د.م`,
                icon: "/chada-logo.png",
              })
            })
          }
        }
      }
    } catch (error) {
      console.error("Error checking for new orders:", error)
      // Don't throw, just log the error
    }
  }, [saveNotifications, loadNotificationsFromStorage])


  // Mark notification as read
  const markAsRead = useCallback((notificationId: number) => {
    const updated = notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    )
    // saveNotifications will sort by newest first
    saveNotifications(updated)
  }, [notifications, saveNotifications])

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    const updated = notifications.map((n) => ({ ...n, read: true }))
    // saveNotifications will sort by newest first
    saveNotifications(updated)
  }, [notifications, saveNotifications])

  // Delete notification
  const deleteNotification = useCallback((notificationId: number) => {
    const updated = notifications.filter((n) => n.id !== notificationId)
    // saveNotifications will sort by newest first
    saveNotifications(updated)
  }, [notifications, saveNotifications])

  // Clear all notifications
  const clearAll = useCallback(() => {
    saveNotifications([])
    if (typeof window !== "undefined") {
      localStorage.removeItem(NOTIFICATIONS_STORAGE_KEY)
    }
  }, [saveNotifications])

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission)
      })
    }
  }, [])

  // Handle WebSocket order notifications
  const handleWebSocketOrder = useCallback((order: WSOrderNotification) => {
    console.log("WebSocket: Received new order notification:", order)
    
    // Create notification from WebSocket order
    const newNotification: Notification = {
      id: Date.now() + order.orderId + Math.random(),
      orderId: order.orderId,
      customerName: order.customerName || "عميل",
      totalAmount: order.totalAmount || 0,
      createdAt: order.createdAt || new Date().toISOString(),
      read: false,
      type: "order",
    }

    // Add to existing notifications
    const existingNotifications = loadNotificationsFromStorage()
    
    // Check for duplicates
    const existingOrderIds = new Set(existingNotifications.map((n: Notification) => n.orderId))
    if (!existingOrderIds.has(newNotification.orderId)) {
      // Add new notification at the beginning (it's the newest)
      const updatedNotifications = [newNotification, ...existingNotifications]
      // Keep only last 50 notifications (saveNotifications will sort by newest first)
      const trimmedNotifications = updatedNotifications.slice(0, 50)
      saveNotifications(trimmedNotifications)

      // Trigger browser notification
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification("طلب جديد", {
          body: `طلب جديد من ${order.customerName || "عميل"} - ${order.totalAmount || 0} د.م`,
          icon: "/chada-logo.png",
        })
      }
    }
  }, [saveNotifications, loadNotificationsFromStorage])

  // Connect to WebSocket
  const { isConnected, reconnectAttempts } = useWebSocket(handleWebSocketOrder)

  // Fallback: Poll for new orders every 30 seconds if WebSocket is not connected
  useEffect(() => {
    if (!isConnected) {
      console.warn("WebSocket not connected, using polling fallback")
      // Initial check immediately
      checkForNewOrders()

      // Then check every 30 seconds (longer interval since WebSocket is preferred)
      const interval = setInterval(() => {
        checkForNewOrders()
      }, 30000) // 30 seconds

      return () => {
        clearInterval(interval)
      }
    } else {
      console.log("WebSocket connected, skipping polling")
      // Do initial check once when WebSocket connects
      checkForNewOrders()
    }
  }, [checkForNewOrders, isConnected])

  // Ensure notifications are always sorted by newest first (most recent at top)
  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a: Notification, b: Notification) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [notifications])

  return {
    notifications: sortedNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    checkForNewOrders,
    isWebSocketConnected: isConnected,
    webSocketReconnectAttempts: reconnectAttempts,
  }
}

