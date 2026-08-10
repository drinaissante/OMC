import { useState, useEffect, useCallback } from "react"
import { STORAGE_KEYS } from "@/lib/constants"

type Theme = "light" | "dark"

function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME)
    if (stored === "light" || stored === "dark") return stored
  } catch (e) {
    // ignore storage access errors
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getStoredTheme)

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme)
    } catch (e) {
      // ignore storage access errors
    }
  }, [theme])

  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEYS.THEME && (e.newValue === "light" || e.newValue === "dark")) {
        setTheme(e.newValue)
      }
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }, [])

  return { theme, toggleTheme }
}
