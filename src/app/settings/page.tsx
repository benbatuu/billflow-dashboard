"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { t, getCurrentLang } from "@/lib/i18n"
import {
    IconUser,
    IconBuilding,
    IconCreditCard,
    IconFileInvoice,
    IconBell,
    IconUsers,
    IconPlug,
    IconShieldLock
} from "@tabler/icons-react"
import ProfileSettingsPage from "./components/profile-settings-page"
import CompanySettingsPage from "./components/company-settings-page"
import BillingSettingsPage from "./components/billing-settings-page"
import InvoicesSettingsPage from "./components/invoices-settings-page"
import NotificationsSettingsPage from "./components/notifications-settings-page"
import TeamSettingsPage from "./components/team-settings-page"
import IntegrationsSettingsPage from "./components/integrations-settings-page"
import SecuritySettingsPage from "./components/security-settings-page"
// --- END Settings Forms ---

const allTabs = [
    { key: "profile", label: "settings.sidebar.profile", roles: ["admin", "owner", "staff", "viewer"], component: ProfileSettingsPage, icon: IconUser },
    { key: "company", label: "settings.sidebar.company", roles: ["admin", "owner"], component: CompanySettingsPage, icon: IconBuilding },
    { key: "billing", label: "settings.sidebar.billing", roles: ["admin", "owner"], component: BillingSettingsPage, icon: IconCreditCard },
    { key: "invoices", label: "settings.sidebar.invoices", roles: ["admin", "owner"], component: InvoicesSettingsPage, icon: IconFileInvoice },
    { key: "notifications", label: "settings.sidebar.notifications", roles: ["owner", "staff"], component: NotificationsSettingsPage, icon: IconBell },
    { key: "team", label: "settings.sidebar.team", roles: ["admin", "owner"], component: TeamSettingsPage, icon: IconUsers },
    { key: "integrations", label: "settings.sidebar.integrations", roles: ["admin", "owner"], component: IntegrationsSettingsPage, icon: IconPlug },
    { key: "security", label: "settings.sidebar.security", roles: ["admin", "owner", "staff", "viewer"], component: SecuritySettingsPage, icon: IconShieldLock },
]

export default function SettingsTabsPage() {
    const [role, setRole] = useState("admin")
    const [tabLabels, setTabLabels] = useState<{ [key: string]: string }>({})
    const [activeTab, setActiveTab] = useState("profile")
    const [lang, setLang] = useState(getCurrentLang())
    const [drawerOpen, setDrawerOpen] = useState(false)

    useEffect(() => {
        if (typeof window !== "undefined") {
            setRole(localStorage.getItem("role") || "admin")
        }
    }, [])

    useEffect(() => {
        Promise.all(allTabs.map(tab => t(tab.label))).then(labels => {
            const obj: { [key: string]: string } = {}
            allTabs.forEach((tab, i) => { obj[tab.key] = labels[i] })
            setTabLabels(obj)
        })
    }, [lang])

    useEffect(() => {
        const onLangChange = () => setLang(getCurrentLang())
        window.addEventListener("langchange", onLangChange)
        return () => window.removeEventListener("langchange", onLangChange)
    }, [])

    const tabs = allTabs.filter(tab => tab.roles.includes(role))
    const activeTabObj = tabs.find(tab => tab.key === activeTab)
    const ActiveIcon = activeTabObj?.icon

    return (
        <div className="w-full min-h-screen p-4">
            {/* Mobil Drawer Butonu */}
            <div className="flex md:hidden mb-6 ">
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="bottom">
                    <DrawerTrigger asChild>
                        <Button variant="outline" className="w-full flex items-center gap-2">
                            {ActiveIcon && <ActiveIcon className="w-5 h-5 mr-1" />}
                            {tabLabels[activeTab] || "Ayarlar"}
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="p-0 shadow-2xl border-t bg-background" style={{ borderTopRightRadius: "36px", borderTopLeftRadius: '36px' }}>
                        <div className="flex flex-col divide-y my-4 max-h-[700px]">
                            {tabs.map(tab => (
                                <DrawerClose asChild key={tab.key}>
                                    <button
                                        className={`w-full text-left px-6 py-4 text-base font-medium hover:bg-accent flex items-center gap-2 ${activeTab === tab.key ? "bg-accent text-primary" : "text-muted-foreground"}`}
                                        onClick={() => { setActiveTab(tab.key); setDrawerOpen(false) }}
                                    >
                                        <tab.icon className="w-5 h-5 mr-2" />
                                        {tabLabels[tab.key] || tab.key}
                                    </button>
                                </DrawerClose>
                            ))}
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
            {/* Desktop Tabs */}
            <div className="hidden md:block">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full flex-nowrap overflow-x-auto scrollbar-thin scrollbar-thumb-muted/40 scrollbar-track-transparent bg-muted p-1 rounded-lg mb-4 gap-2 border-b border-border"
                        style={{ WebkitOverflowScrolling: "touch" }}>
                        {tabs.map(tab => (
                            <TabsTrigger
                                key={tab.key}
                                value={tab.key}
                                className="flex-shrink-0 px-4 py-2 text-base min-w-[120px] whitespace-nowrap rounded-t-md data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center gap-2"
                            >
                                <tab.icon className="w-5 h-5 mr-2" />
                                {tabLabels[tab.key] || tab.key}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>
            {/* İçerik */}
            <div className="w-full">
                {tabs.map(tab => (
                    <div key={tab.key} style={{ display: activeTab === tab.key ? "block" : "none" }}>
                        <tab.component />
                    </div>
                ))}
            </div>
        </div>
    )
} 