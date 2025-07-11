"use client"

export default function CustomersPage() {
  return (
    <div className="w-full mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Müşteriler (Demo)</h1>
      <ul className="space-y-2">
        <li className="p-4 bg-card rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
          <span className="font-medium">Acme Corp</span>
          <span className="text-muted-foreground">acme@example.com</span>
        </li>
        <li className="p-4 bg-card rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
          <span className="font-medium">Beta Ltd</span>
          <span className="text-muted-foreground">beta@company.com</span>
        </li>
        <li className="p-4 bg-card rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
          <span className="font-medium">Charlie Freelance</span>
          <span className="text-muted-foreground">charlie@freelance.com</span>
        </li>
      </ul>
    </div>
  )
} 