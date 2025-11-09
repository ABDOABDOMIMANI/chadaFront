import { useEffect, useRef, useState, useCallback } from "react"
import { API_BASE_URL } from "@/lib/api"

export interface OrderNotification {
  orderId: number
  customerName: string
  customerEmail: string
  customerPhone: string
  totalAmount: number
  createdAt: string
}

export function useWebSocket(onOrderReceived: (order: OrderNotification) => void) {
  const [isConnected, setIsConnected] = useState(false)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const maxReconnectAttempts = 5
  const reconnectDelay = 3000 // 3 seconds

  const connect = useCallback(() => {
    try {
      // Determine WebSocket URL based on API_BASE_URL
      let wsUrl: string
      if (API_BASE_URL.startsWith("https://")) {
        // For HTTPS, use WSS (secure WebSocket)
        wsUrl = API_BASE_URL.replace("https://", "wss://")
      } else if (API_BASE_URL.startsWith("http://")) {
        // For HTTP, use WS (non-secure WebSocket)
        wsUrl = API_BASE_URL.replace("http://", "ws://")
      } else {
        console.error("Invalid API_BASE_URL:", API_BASE_URL)
        return
      }

      // Remove trailing slash if present
      wsUrl = wsUrl.replace(/\/$/, "")
      
      // Add WebSocket endpoint
      wsUrl = `${wsUrl}/ws`

      console.log("Connecting to WebSocket:", wsUrl)

      // Try native WebSocket first
      const ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        console.log("WebSocket connected successfully")
        setIsConnected(true)
        setReconnectAttempts(0)
        
        // Subscribe to orders topic
        if (ws.readyState === WebSocket.OPEN) {
          // For STOMP protocol, we need to send a CONNECT frame
          // But for simple WebSocket, we'll use SockJS which handles this
          // For now, let's use SockJS client
          connectWithSockJS()
        }
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        setIsConnected(false)
      }

      ws.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason)
        setIsConnected(false)
        wsRef.current = null
        
        // Attempt to reconnect
        if (reconnectAttempts < maxReconnectAttempts) {
          const delay = reconnectDelay * Math.pow(2, reconnectAttempts) // Exponential backoff
          console.log(`Reconnecting in ${delay}ms... (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1)
            connect()
          }, delay)
        } else {
          console.error("Max reconnection attempts reached. WebSocket will not reconnect.")
        }
      }

      wsRef.current = ws
    } catch (error) {
      console.error("Error creating WebSocket connection:", error)
      setIsConnected(false)
    }
  }, [reconnectAttempts, maxReconnectAttempts, reconnectDelay])

  const connectWithSockJS = useCallback(() => {
    // Load SockJS and STOMP libraries dynamically
    if (typeof window === "undefined") return

    const initializeStomp = () => {
      try {
        // @ts-ignore - SockJS and STOMP are loaded dynamically
        const SockJS = (window as any).SockJS
        // @ts-ignore
        const { Client } = (window as any).StompJs

        if (!SockJS || !Client) {
          console.error("SockJS or STOMP not loaded")
          setIsConnected(false)
          return
        }

        let wsUrl: string
        if (API_BASE_URL.startsWith("https://")) {
          wsUrl = API_BASE_URL.replace(/\/$/, "") + "/ws"
        } else {
          wsUrl = API_BASE_URL.replace(/\/$/, "") + "/ws"
        }

        console.log("Connecting with SockJS:", wsUrl)

        const socket = new SockJS(wsUrl)
        const stompClient = new Client({
          webSocketFactory: () => socket,
          debug: (str: string) => {
            if (process.env.NODE_ENV === "development") {
              console.log("STOMP:", str)
            }
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        })

        stompClient.onConnect = (frame: any) => {
          console.log("STOMP Connected:", frame)
          setIsConnected(true)
          setReconnectAttempts(0)

          // Subscribe to orders topic
          stompClient.subscribe("/topic/orders", (message: any) => {
            try {
              const order: OrderNotification = JSON.parse(message.body)
              console.log("Received new order via WebSocket:", order)
              onOrderReceived(order)
            } catch (error) {
              console.error("Error parsing WebSocket message:", error)
            }
          })

          console.log("Subscribed to /topic/orders")
        }

        stompClient.onStompError = (frame: any) => {
          console.error("STOMP error:", frame)
          setIsConnected(false)
        }

        stompClient.onWebSocketClose = (event: CloseEvent) => {
          console.log("WebSocket closed:", event)
          setIsConnected(false)
          
          // Attempt to reconnect
          const currentAttempts = reconnectAttempts
          if (currentAttempts < maxReconnectAttempts) {
            const delay = reconnectDelay * Math.pow(2, currentAttempts)
            console.log(`Reconnecting in ${delay}ms... (attempt ${currentAttempts + 1}/${maxReconnectAttempts})`)
            
            reconnectTimeoutRef.current = setTimeout(() => {
              setReconnectAttempts(prev => prev + 1)
              connectWithSockJS()
            }, delay)
          }
        }

        stompClient.activate()

        // Store reference for cleanup
        wsRef.current = socket as any
        ;(wsRef.current as any).stompClient = stompClient
      } catch (error) {
        console.error("Error initializing STOMP:", error)
        setIsConnected(false)
      }
    }

    // Check if scripts are already loaded
    if ((window as any).SockJS && (window as any).StompJs) {
      initializeStomp()
      return
    }

    // Load SockJS first
    const sockJSScript = document.createElement("script")
    sockJSScript.src = "https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"
    sockJSScript.onload = () => {
      // Then load STOMP
      const stompScript = document.createElement("script")
      stompScript.src = "https://cdn.jsdelivr.net/npm/@stomp/stompjs@7/bundles/stomp.umd.min.js"
      stompScript.onload = () => {
        initializeStomp()
      }
      stompScript.onerror = () => {
        console.error("Failed to load STOMP library")
        setIsConnected(false)
      }
      document.head.appendChild(stompScript)
    }
    sockJSScript.onerror = () => {
      console.error("Failed to load SockJS library")
      setIsConnected(false)
    }
    document.head.appendChild(sockJSScript)
  }, [reconnectAttempts, onOrderReceived, maxReconnectAttempts, reconnectDelay])

  useEffect(() => {
    // Connect on mount
    connectWithSockJS()

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current) {
        try {
          // If STOMP client exists, deactivate it first
          if ((wsRef.current as any).stompClient) {
            (wsRef.current as any).stompClient.deactivate()
          }
          wsRef.current.close()
        } catch (error) {
          console.error("Error closing WebSocket:", error)
        }
        wsRef.current = null
      }
      setIsConnected(false)
    }
  }, [connectWithSockJS]) // Only run on mount/unmount

  return {
    isConnected,
    reconnectAttempts,
  }
}

