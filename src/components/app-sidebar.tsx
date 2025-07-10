"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
  IconDashboard,
  IconFileText,
  IconUsers,
  IconCreditCard,
  IconReport,
  IconBell,
  IconSettings,
  IconPlug,
  IconHelp,
  IconUserCheck,
  IconFileInvoice,
  IconUser,
  IconBuilding,
  IconShieldLock,
  IconMail,
  IconChevronRight,
  IconChevronDown,
} from "@tabler/icons-react"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { t, getCurrentLang } from "@/lib/i18n"
import { cn } from "@/lib/utils"

// Menü grupları
const menuGroups = [
  {
    group: 'dashboard',
    title: 'Ana Menü',
    items: [
      { label: 'dashboard', href: '/', icon: IconDashboard, roles: ['admin', 'owner', 'staff', 'viewer'] },
    ],
  },
  {
    group: 'billing',
    title: 'Fatura & Müşteri',
    items: [
      { label: 'invoices', href: '/invoices', icon: IconFileInvoice, roles: ['admin', 'owner', 'staff'] },
      { label: 'customers', href: '/customers', icon: IconUsers, roles: ['admin', 'owner', 'staff'] },
      { label: 'subscriptions', href: '/subscriptions', icon: IconFileText, roles: ['admin', 'owner'] },
      { label: 'payments', href: '/payments', icon: IconCreditCard, roles: ['admin', 'owner', 'staff'] },
    ],
  },
  {
    group: 'reports',
    title: 'Raporlar',
    items: [
      { label: 'reports', href: '/reports', icon: IconReport, roles: ['admin', 'owner', 'staff', 'viewer'] },
    ],
  },
  {
    group: 'settings',
    title: 'Ayarlar',
    items: [
      { label: 'settings', href: '/settings', icon: IconSettings, roles: ['admin', 'owner'], hasSubmenu: true },
      { label: 'support', href: '/support', icon: IconHelp, roles: ['admin', 'owner', 'staff', 'viewer'] },
    ],
  },
]

// Settings alt menüleri
const settingsSubmenu = [
  { label: 'profile', href: '/settings/profile', icon: IconUser, roles: ['admin', 'owner', 'staff', 'viewer'] },
  { label: 'company', href: '/settings/company', icon: IconBuilding, roles: ['admin', 'owner'] },
  { label: 'billing', href: '/settings/billing', icon: IconCreditCard, roles: ['admin', 'owner'] },
  { label: 'invoices', href: '/settings/invoices', icon: IconFileInvoice, roles: ['admin', 'owner'] },
  { label: 'notifications', href: '/settings/notifications', icon: IconBell, roles: ['owner', 'staff'] },
  { label: 'team', href: '/settings/team', icon: IconUsers, roles: ['admin', 'owner'] },
  { label: 'integrations', href: '/settings/integrations', icon: IconPlug, roles: ['admin', 'owner'] },
  { label: 'security', href: '/settings/security', icon: IconShieldLock, roles: ['admin', 'owner', 'staff', 'viewer'] },
]

function getUserRole() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("role") || "admin"
  }
  return "admin"
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [role, setRole] = React.useState("admin")
  const [labels, setLabels] = React.useState<{ [key: string]: string }>({})
  const [lang, setLang] = React.useState(getCurrentLang())
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set(['dashboard']))
  const [expandedSettings, setExpandedSettings] = React.useState(false)

  // Dil değişimini dinle (hem storage event'i hem custom event)
  React.useEffect(() => {
    const onStorage = () => setLang(getCurrentLang())
    const onLangChange = () => setLang(getCurrentLang())
    window.addEventListener("storage", onStorage)
    window.addEventListener("langchange", onLangChange)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("langchange", onLangChange)
    }
  }, [])

  // Dil veya rol değiştiğinde menü başlıklarını güncelle
  React.useEffect(() => {
    setRole(getUserRole())
    // Tüm gruplardaki item'ları ve settings submenu'lerini topla
    const allItems = [
      ...menuGroups.flatMap(g => g.items),
      ...settingsSubmenu
    ]
    Promise.all(allItems.map(item => t(`sidebar.${item.label}`))).then(arr => {
      const obj: { [key: string]: string } = {}
      allItems.forEach((item, i) => { obj[item.label] = arr[i] })
      setLabels(obj)
    })
  }, [lang])

  // Settings sayfalarında ise settings menüsünü açık tut
  React.useEffect(() => {
    if (pathname.startsWith('/settings/')) {
      setExpandedSettings(true)
    }
  }, [pathname])

  // Rol ile filtrelenmiş menü grupları
  const filteredGroups = menuGroups.map(group => ({
    ...group,
    items: group.items.filter(item => item.roles.includes(role)),
  })).filter(group => group.items.length > 0)

  const filteredSettingsSubmenu = settingsSubmenu.filter(item => item.roles.includes(role))

  // Aktif menüyü kontrol et
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  // Settings menüsünün aktif olup olmadığını kontrol et
  const isSettingsActive = pathname.startsWith('/settings')

  const toggleGroup = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey)
    } else {
      newExpanded.add(groupKey)
    }
    setExpandedGroups(newExpanded)
  }

  const toggleSettings = () => {
    setExpandedSettings(!expandedSettings)
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-b border-border/50 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-3 hover:bg-accent/50 transition-colors"
            >
              <a href="#" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <IconBuilding className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-semibold">Acme Inc.</span>
                  <span className="text-xs text-muted-foreground">Billflow Dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4">
        {filteredGroups.map(group => (
          <SidebarGroup key={group.group} className="mb-6">
            <SidebarGroupContent>
              <div className="px-3 mb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.title}
                </h3>
              </div>
              <SidebarMenu>
                {group.items.map(item => (
                  <SidebarMenuItem key={item.label}>
                    {item.hasSubmenu ? (
                      <>
                        <SidebarMenuButton 
                          onClick={toggleSettings}
                          className={cn(
                            "w-full justify-between transition-colors",
                            isSettingsActive 
                              ? "bg-primary/10 text-primary border-r-2 border-primary" 
                              : "hover:bg-accent/50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {item.icon && <item.icon className="size-5" />}
                            <span className="font-medium">{labels[item.label] || item.label}</span>
                          </div>
                          {expandedSettings ? (
                            <IconChevronDown className="size-4" />
                          ) : (
                            <IconChevronRight className="size-4" />
                          )}
                        </SidebarMenuButton>
                        {expandedSettings && (
                          <div className="ml-6 mt-2 space-y-1">
                            {filteredSettingsSubmenu.map(subItem => (
                              <SidebarMenuButton
                                key={subItem.label}
                                asChild
                                className={cn(
                                  "w-full justify-start transition-colors text-sm",
                                  isActive(subItem.href)
                                    ? "bg-primary/10 text-primary border-r-2 border-primary"
                                    : "hover:bg-accent/30"
                                )}
                              >
                                <a href={subItem.href} className="flex items-center gap-3 px-3 py-2">
                                  {subItem.icon && <subItem.icon className="size-4" />}
                                  <span>{labels[subItem.label] || subItem.label}</span>
                                </a>
                              </SidebarMenuButton>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <SidebarMenuButton 
                        asChild
                        className={cn(
                          "w-full justify-start transition-colors",
                          isActive(item.href)
                            ? "bg-primary/10 text-primary border-r-2 border-primary"
                            : "hover:bg-accent/50"
                        )}
                      >
                        <a href={item.href} className="flex items-center gap-3 px-3 py-2">
                          {item.icon && <item.icon className="size-5" />}
                          <span className="font-medium">{labels[item.label] || item.label}</span>
                        </a>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border/50 pt-4">
        <NavUser user={{ name: "Demo User", email: "a@b.com", avatar: "/avatars/shadcn.jpg" }} />
      </SidebarFooter>
    </Sidebar>
  )
}
