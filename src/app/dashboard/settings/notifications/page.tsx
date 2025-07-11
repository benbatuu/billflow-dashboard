"use client"

import NotificationsSettingsPage from "../components/notifications-settings-page"

export default function NotificationsPage() {
  return (
    <div className="w-full min-h-screen p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Bildirim Ayarları</h1>
        <p className="text-muted-foreground">E-posta ve SMS bildirim tercihlerinizi yönetin</p>
      </div>
      <NotificationsSettingsPage />
    </div>
  )
} 