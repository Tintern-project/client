"use client"

import { useEffect, useState } from "react"

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.body.classList.add("dark-mode")
    }
  }, [])

  const toggleTheme = () => {
    if (isDarkMode) {
      document.body.classList.remove("dark-mode")
      localStorage.setItem("theme", "light")
      setIsDarkMode(false)
    } else {
      document.body.classList.add("dark-mode")
      localStorage.setItem("theme", "dark")
      setIsDarkMode(true)
    }
  }

  return (
    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
      {isDarkMode ? "☀️" : "🌙"}
    </button>
  )
}

