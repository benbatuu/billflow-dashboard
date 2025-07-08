"use client"

import { useState, useEffect } from "react"

const languages = [
    { code: "tr", label: "Türkçe" },
    { code: "en", label: "English" },
]

export function LanguageSwitcher() {
    const [lang, setLang] = useState("tr")

    useEffect(() => {
        const stored = localStorage.getItem("lang")
        if (stored) setLang(stored)
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLang(e.target.value)
        localStorage.setItem("lang", e.target.value)
        window.dispatchEvent(new Event("langchange"))
    }

    return (
        <select
            value={lang}
            onChange={handleChange}
            className="border rounded px-2 py-1 text-sm bg-background"
            aria-label="Dil seçici"
        >
            {languages.map(l => (
                <option key={l.code} value={l.code}>{l.label}</option>
            ))}
        </select>
    )
} 