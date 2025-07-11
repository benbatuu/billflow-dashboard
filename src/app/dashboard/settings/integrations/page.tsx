"use client"

import IntegrationsSettingsPage from "../components/integrations-settings-page"

export default function IntegrationsPage() {
  return (
    <div className="w-full min-h-screen p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Entegrasyonlar</h1>
        <p className="text-muted-foreground">Stripe, iyzico ve diğer servis entegrasyonlarınızı yönetin</p>
      </div>
      <IntegrationsSettingsPage />
    </div>
  )
} 