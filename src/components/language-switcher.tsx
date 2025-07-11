"use client"

import { useState, useEffect } from "react"
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select"

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

    const handleChange = (value: string) => {
        setLang(value)
        localStorage.setItem("lang", value)
        window.dispatchEvent(new Event("langchange"))
    }

    return (
        <Select value={lang} onValueChange={handleChange}>
            <SelectTrigger className="w-24" aria-label="Dil seçici">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {languages.map(l => (
                    <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
} 