"use client"

import SecuritySettingsPage from "../components/security-settings-page"

export default function SecurityPage() {
  return (
    <div className="w-full min-h-screen p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Güvenlik Ayarları</h1>
        <p className="text-muted-foreground">Şifre, 2FA ve güvenlik tercihlerinizi yönetin</p>
      </div>
      <SecuritySettingsPage />
    </div>
  )
} 