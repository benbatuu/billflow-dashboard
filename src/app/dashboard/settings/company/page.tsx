"use client"

import CompanySettingsPage from "../components/company-settings-page"

export default function CompanyPage() {
  return (
    <div className="w-full min-h-screen p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Şirket Ayarları</h1>
        <p className="text-muted-foreground">Şirket bilgilerinizi ve fatura ayarlarınızı yönetin</p>
      </div>
      <CompanySettingsPage />
    </div>
  )
} 