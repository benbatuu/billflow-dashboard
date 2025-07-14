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
  IconFileInvoice,
  IconUser,
  IconBuilding,
  IconShieldLock,
  IconChevronRight,
  IconChevronDown,
} from "@tabler/icons-react"

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

const menuGroups = [
  // Admin, owner ve superadmin için menüler
  {
    group: 'dashboard',
    title: 'Ana Menü',
    items: [
      { label: 'dashboard', href: '/', icon: IconDashboard, roles: ['superadmin', 'admin', 'owner', 'accountant', 'viewer'] },
    ],
  },
  {
    group: 'billing',
    title: 'Fatura & Müşteri',
    items: [
      { label: 'invoices', href: '/dashboard/invoices', icon: IconFileInvoice, roles: ['superadmin', 'admin', 'owner', 'accountant'] },
      { label: 'customers', href: '/dashboard/customers', icon: IconUsers, roles: ['superadmin', 'admin', 'owner'] },
      { label: 'subscriptions', href: '/dashboard/subscriptions', icon: IconFileText, roles: ['superadmin', 'admin', 'owner'] },
      { label: 'payments', href: '/dashboard/payments', icon: IconCreditCard, roles: ['superadmin', 'admin', 'owner'] },
    ],
  },
  {
    group: 'reports',
    title: 'Raporlar',
    items: [
      { label: 'reports', href: '/dashboard/reports', icon: IconReport, roles: ['superadmin', 'admin', 'owner', 'accountant'] },
    ],
  },
  {
    group: 'settings',
    title: 'Ayarlar',
    items: [
      { label: 'settings', href: '/dashboard/settings', icon: IconSettings, roles: ['superadmin', 'admin', 'owner'] },
      { label: 'support', href: '/dashboard/support', icon: IconHelp, roles: ['superadmin', 'admin', 'owner', 'accountant', 'viewer'] },
    ],
  },
  // Süper Admin Menüsü
  {
    group: 'system',
    title: 'Sistem Yönetimi',
    items: [
      { label: 'system-stats', href: '/dashboard/system-stats', icon: IconReport, roles: ['superadmin'] },
      { label: 'companies', href: '/dashboard/companies', icon: IconBuilding, roles: ['superadmin'] },
      { label: 'users', href: '/dashboard/users', icon: IconUsers, roles: ['superadmin'] },
      { label: 'plans', href: '/dashboard/plans', icon: IconCreditCard, roles: ['superadmin'] },
      { label: 'system-settings', href: '/dashboard/system-settings', icon: IconSettings, roles: ['superadmin'] },
      { label: 'logs', href: '/dashboard/logs', icon: IconFileText, roles: ['superadmin'] },
    ],
  },
]

const settingsSubmenu = [
  { label: 'company', href: '/dashboard/settings/company', icon: IconBuilding, roles: ['superadmin', 'admin', 'owner'] },
  { label: 'billing', href: '/dashboard/settings/billing', icon: IconCreditCard, roles: ['superadmin', 'admin', 'owner'] },
  { label: 'invoices', href: '/dashboard/settings/invoices', icon: IconFileInvoice, roles: ['superadmin', 'admin', 'owner'] },
  { label: 'notifications', href: '/dashboard/settings/notifications', icon: IconBell, roles: ['superadmin', 'owner'] },
  { label: 'team', href: '/dashboard/settings/team', icon: IconUsers, roles: ['superadmin', 'admin', 'owner'] },
  { label: 'integrations', href: '/dashboard/settings/integrations', icon: IconPlug, roles: ['superadmin', 'admin', 'owner'] },
  { label: 'security', href: '/dashboard/settings/security', icon: IconShieldLock, roles: ['superadmin', 'admin', 'owner', 'accountant', 'viewer'] },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [role, setRole] = React.useState<string | null>(null)
  const [labels, setLabels] = React.useState<{ [key: string]: string }>({})
  const [lang, setLang] = React.useState(getCurrentLang())
  const [expandedSettings, setExpandedSettings] = React.useState(false)

  // Gerçek rolü sunucudan çek ve localStorage'ı güncelle (her sayfa değişiminde ve storage event'inde)
  React.useEffect(() => {
    async function fetchRole() {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          let roleName = null;
          if (data.role) {
            if (typeof data.role === 'string') {
              roleName = data.role;
            } else if (typeof data.role === 'object' && data.role.name) {
              roleName = data.role.name;
            }
          }
          if (roleName) {
            console.log("Fetched role from /api/auth/me:", roleName);
            console.log("localStorage before set:", localStorage.getItem('role'));
            setRole(roleName)
            if (typeof window !== 'undefined') {
              localStorage.setItem('role', roleName)
              console.log("localStorage after set:", localStorage.getItem('role'));
            }
          }
        }
      } catch (err) {
        console.error("Error fetching role:", err);
      }
    }
    fetchRole()
    // Storage event ile başka tabda değişirse de güncelle
    const onStorage = () => fetchRole()
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [pathname])

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
  }, [lang, role])

  // Settings sayfalarında ise settings menüsünü açık tut
  React.useEffect(() => {
    if (pathname.startsWith('/settings/')) {
      setExpandedSettings(true)
    }
  }, [pathname])

  // Eğer rol null ise, loading göster
  if (!role) {
    return <div className="p-4 text-muted-foreground">Yükleniyor...</div>;
  }

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

  const isSettingsActive = pathname.startsWith('/settings')


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

      <SidebarContent className="px-2">
        {filteredGroups.map(group => (
          <SidebarGroup key={group.group} className="mb-6">
            <SidebarGroupContent>
              <div className="px-3 mb-1">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.title}
                </h3>
              </div>
              <SidebarMenu>
                {group.items.map(item => (
                  <SidebarMenuItem key={item.label}>
                    {item.roles.includes('settings') ? (
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

    </Sidebar>
  )
}
