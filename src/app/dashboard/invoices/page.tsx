"use client"

import * as React from "react"
import rawData from '@/app/dashboard/data.json'
import { DataTable } from "@/components/data-table"
import { ColumnDef } from "@tanstack/react-table"

function getArray(data: any): any[] {
    if (Array.isArray(data)) return data
    if (data && Array.isArray(data.default)) return data.default
    return []
}

const arr = getArray(rawData)
const data = arr.map((item: any, i: number) => ({
    number: item.id,
    customer: item.reviewer,
    amount: item.target,
    status: item.status,
    group: item.type,
    date: new Date(2024, 0, 1 + i).toISOString().slice(0, 10),
}))

const columns: ColumnDef<any>[] = [
  { accessorKey: "number", header: "Fatura No" },
  { accessorKey: "customer", header: "Müşteri" },
  { accessorKey: "amount", header: "Tutar", cell: info => `₺${info.getValue()}` },
  { accessorKey: "status", header: "Durum" },
  { accessorKey: "group", header: "Grup" },
  { accessorKey: "date", header: "Tarih" },
]

export default function InvoicesPage() {
    return (
        <div className="w-full mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Invoices (Demo)</h1>
            <DataTable data={data} columns={columns} />
        </div>
    )
} 