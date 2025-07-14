"use client"

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import React from "react";

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { logout } = useAuth();
  const router = useRouter();

  // Rolü localStorage'dan al
  const [role, setRole] = React.useState<string>("admin");
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role") || "admin");
    }
  }, []);

  const handleLogout = async () => {
    logout();
    router.replace("/auth/login");
  };

  const handleAccount = () => {
    router.push("/dashboard/settings/profile");
  };
  const handleBilling = () => {
    router.push("/dashboard/settings/billing");
  };
  const handleNotifications = () => {
    router.push("/dashboard/notifications");
  };

  // Menüde hangi itemlar hangi role göre görünecek
  const showBilling = role === "admin" || role === "owner";
  const showNotifications = role === "owner" || role === "staff";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted transition">
          <Avatar className="h-8 w-8 rounded-lg grayscale">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="hidden md:grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="text-muted-foreground truncate text-xs">
              {user.email}
            </span>
          </div>
          <IconDotsVertical className="ml-auto size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-56 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleAccount}>
            <IconUserCircle />
            Account
          </DropdownMenuItem>
          {showBilling && (
            <DropdownMenuItem onClick={handleBilling}>
              <IconCreditCard />
              Billing
            </DropdownMenuItem>
          )}
          {showNotifications && (
            <DropdownMenuItem onClick={handleNotifications}>
              <IconNotification />
              Notifications
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <IconLogout />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
