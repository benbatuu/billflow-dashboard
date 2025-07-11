"use client"

export default function PaymentsPage() {
  return (
    <div className="w-full mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Ödemeler (Demo)</h1>
      <ul className="space-y-2">
        <li className="p-4 bg-card rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
          <span className="font-medium">Fatura #1001</span>
          <span className="text-muted-foreground">₺1.200 • Başarılı</span>
        </li>
        <li className="p-4 bg-card rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
          <span className="font-medium">Fatura #1002</span>
          <span className="text-muted-foreground">₺800 • Beklemede</span>
        </li>
      </ul>
    </div>
  )
} 