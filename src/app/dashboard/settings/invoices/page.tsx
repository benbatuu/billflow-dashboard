"use client"

import InvoicesSettingsPage from "../components/invoices-settings-page"

export default function InvoicesPage() {
  return (
    <div className="w-full min-h-screen p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Fatura Ayarları</h1>
        <p className="text-muted-foreground">Fatura şablonları ve numaralandırma ayarlarınızı yönetin</p>
      </div>
      <InvoicesSettingsPage />
    </div>
  )
} 