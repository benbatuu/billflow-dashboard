"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { t, getCurrentLang } from "@/lib/i18n"

const allTabs = [
    { key: "profile", label: "settings.sidebar.profile", roles: ["admin", "owner", "staff", "viewer"] },
    { key: "company", label: "settings.sidebar.company", roles: ["admin", "owner"] },
    { key: "billing", label: "settings.sidebar.billing", roles: ["admin", "owner"] },
    { key: "invoices", label: "settings.sidebar.invoices", roles: ["admin", "owner"] },
    { key: "notifications", label: "settings.sidebar.notifications", roles: ["owner", "staff"] },
    { key: "team", label: "settings.sidebar.team", roles: ["admin", "owner"] },
    { key: "integrations", label: "settings.sidebar.integrations", roles: ["admin", "owner"] },
    { key: "security", label: "settings.sidebar.security", roles: ["admin", "owner", "staff", "viewer"] },
]

export default function SettingsSidebar() {
    const [role, setRole] = useState("admin")
    const [labels, setLabels] = useState<{ [key: string]: string }>({})
    const [sidebarTitle, setSidebarTitle] = useState("")
    const pathname = usePathname()
    const router = useRouter()
    const [lang, setLang] = useState(getCurrentLang())

    useEffect(() => {
        if (typeof window !== "undefined") {
            setRole(localStorage.getItem("role") || "admin")
        }
    }, [])

    useEffect(() => {
        Promise.all([
            t("settings.sidebar.title"),
            ...allTabs.map(tab => t(tab.label))
        ]).then(([title, ...tabLabels]) => {
            setSidebarTitle(title)
            const obj: { [key: string]: string } = {}
            allTabs.forEach((tab, i) => { obj[tab.key] = tabLabels[i] })
            setLabels(obj)
        })
    }, [lang])

    useEffect(() => {
        const onLangChange = () => setLang(getCurrentLang())
        window.addEventListener("langchange", onLangChange)
        return () => window.removeEventListener("langchange", onLangChange)
    }, [])

    const tabs = allTabs.filter(tab => tab.roles.includes(role))
    const active = pathname.split("/").pop()

    return (
        <aside className="w-56 border-r bg-card flex flex-col py-8 px-4 gap-2">
            <div className="text-lg font-bold mb-6">{sidebarTitle}</div>
            {tabs.map(tab => (
                <button
                    key={tab.key}
                    className={cn(
                        "w-full text-left px-3 py-2 rounded transition font-medium hover:bg-accent",
                        active === tab.key ? "bg-accent text-primary" : "text-muted-foreground"
                    )}
                    onClick={() => router.push(`/settings/${tab.key}`)}
                >
                    {labels[tab.key] || tab.key}
                </button>
            ))}
        </aside>
    )
} 