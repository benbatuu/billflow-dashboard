"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()

    const isDark = theme === "dark"

    return (
        <Button
            size="icon"
            variant="ghost"
            aria-label="Tema değiştir"
            onClick={() => setTheme(isDark ? "light" : "dark")}
        >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
    )
} 