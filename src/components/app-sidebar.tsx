"use client"

import * as React from "react"
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
} from "@/components/ui/sidebar"
import { t, getCurrentLang } from "@/lib/i18n"

const menuItems = [
  { label: 'dashboard', href: '/', icon: IconDashboard, roles: ['admin', 'owner', 'staff', 'viewer'] },
  { label: 'invoices', href: '/invoices', icon: IconFileInvoice, roles: ['admin', 'owner', 'staff'] },
  { label: 'customers', href: '/customers', icon: IconUser, roles: ['admin', 'owner', 'staff'] },
  { label: 'subscriptions', href: '/subscriptions', icon: IconFileText, roles: ['admin', 'owner'] },
  { label: 'payments', href: '/payments', icon: IconCreditCard, roles: ['admin', 'owner', 'staff'] },
  { label: 'reports', href: '/reports', icon: IconReport, roles: ['admin', 'owner', 'staff', 'viewer'] },
  { label: 'notifications', href: '/notifications', icon: IconBell, roles: ['admin', 'owner'] },
  { label: 'team', href: '/team', icon: IconUsers, roles: ['admin', 'owner', 'staff'] },
  { label: 'settings', href: '/settings', icon: IconSettings, roles: ['admin', 'owner'] },
  { label: 'integrations', href: '/integrations', icon: IconPlug, roles: ['admin', 'owner'] },
  { label: 'support', href: '/support', icon: IconHelp, roles: ['admin', 'owner', 'staff', 'viewer'] },
]

function getUserRole() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("role") || "admin"
  }
  return "admin"
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [role, setRole] = React.useState("admin")
  const [labels, setLabels] = React.useState<{ [key: string]: string }>({})
  const [lang, setLang] = React.useState(getCurrentLang())

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
    Promise.all(menuItems.map(item => t(`sidebar.${item.label}`))).then(arr => {
      const obj: { [key: string]: string } = {}
      menuItems.forEach((item, i) => { obj[item.label] = arr[i] })
      setLabels(obj)
    })
  }, [lang])

  const filteredMenu = menuItems.filter(item => item.roles.includes(role))

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {filteredMenu.map(item => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton asChild>
                <a href={item.href} className="flex items-center gap-2">
                  {item.icon && <item.icon className="size-5" />}
                  <span>{labels[item.label] || item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: "Demo User", email: "a@b.com", avatar: "/avatars/shadcn.jpg" }} />
      </SidebarFooter>
    </Sidebar>
  )
}
