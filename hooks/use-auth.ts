"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function useAuth(redirectTo = "/login") {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const auth = localStorage.getItem("chada_auth") === "true"
        setIsAuthenticated(auth)
        setIsLoading(false)
        if (!auth && redirectTo) {
          router.push(redirectTo)
        }
      }
    }

    checkAuth()
  }, [router, redirectTo])

  return { isAuthenticated, isLoading }
}

