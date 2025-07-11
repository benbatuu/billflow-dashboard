"use client"

export default function ReportsPage() {
  return (
    <div className="w-full mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Raporlar (Demo)</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-card rounded shadow">
          <div className="font-medium">Toplam Gelir</div>
          <div className="text-2xl font-bold">₺12.500</div>
        </div>
        <div className="p-4 bg-card rounded shadow">
          <div className="font-medium">Toplam Fatura</div>
          <div className="text-2xl font-bold">32</div>
        </div>
        <div className="p-4 bg-card rounded shadow">
          <div className="font-medium">Aktif Abonelik</div>
          <div className="text-2xl font-bold">7</div>
        </div>
      </div>
    </div>
  )
} 