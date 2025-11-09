"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"
type Language = "ar" | "en"

interface ThemeContextType {
  theme: Theme
  language: Language
  toggleTheme: () => void
  toggleLanguage: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [language, setLanguage] = useState<Language>("ar")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const storedTheme = (localStorage.getItem("theme") as Theme) || "light"
    const storedLanguage = (localStorage.getItem("language") as Language) || "ar"

    setTheme(storedTheme)
    setLanguage(storedLanguage)
    applyThemeAndLanguage(storedTheme, storedLanguage)
    setMounted(true)
  }, [])

  const applyThemeAndLanguage = (newTheme: Theme, newLanguage: Language) => {
    document.documentElement.setAttribute("data-theme", newTheme)
    document.documentElement.setAttribute("dir", newLanguage === "ar" ? "rtl" : "ltr")
    document.documentElement.lang = newLanguage
    document.documentElement.classList.toggle("dark", newTheme === "dark")
    document.body.classList.toggle("dark", newTheme === "dark")
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    applyThemeAndLanguage(newTheme, language)
  }

  const toggleLanguage = () => {
    const newLanguage = language === "ar" ? "en" : "ar"
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
    applyThemeAndLanguage(theme, newLanguage)
  }

  return (
    <ThemeContext.Provider value={{ theme, language, toggleTheme, toggleLanguage }}>{children}</ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}
