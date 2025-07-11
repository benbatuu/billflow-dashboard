"use client"

export default function SupportPage() {
  return (
    <div className="w-full mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Destek</h1>
      <p className="mb-4">Her türlü soru ve destek talebiniz için bize ulaşabilirsiniz.</p>
      <ul className="space-y-2">
        <li className="p-4 bg-card rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
          <span className="font-medium">E-posta</span>
          <span className="text-muted-foreground">support@acme.com</span>
        </li>
        <li className="p-4 bg-card rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
          <span className="font-medium">Telefon</span>
          <span className="text-muted-foreground">+90 555 123 45 67</span>
        </li>
      </ul>
    </div>
  )
} 