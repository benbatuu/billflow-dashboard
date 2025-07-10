"use client"

import BillingSettingsPage from "../components/billing-settings-page"

export default function BillingPage() {
  return (
    <div className="w-full min-h-screen p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Faturalandırma Ayarları</h1>
        <p className="text-muted-foreground">Abonelik planınızı ve ödeme yöntemlerinizi yönetin</p>
      </div>
      <BillingSettingsPage />
    </div>
  )
} 