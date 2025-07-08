"use client"

import * as React from "react"
import rawData from '@/app/dashboard/data.json'
import { DataTable, DataTableColumn } from "@/components/data-table"

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

const columns: DataTableColumn[] = [
    { key: "number", header: "Fatura No", width: 120, align: "left", style: { fontWeight: 500 } },
    { key: "customer", header: "Müşteri", width: 180, align: "left", style: { color: "#222" } },
    { key: "amount", header: "Tutar", width: 120, align: "right", cell: (row) => `₺${row.amount}`, style: { fontVariantNumeric: "tabular-nums" } },
    { key: "status", header: "Durum", width: 120, align: "center", cell: (row) => row.status },
    { key: "group", header: "Grup", width: 120, align: "left" },
    { key: "date", header: "Tarih", width: 120, align: "center", cell: (row) => row.date },
]

export default function InvoicesPage() {
    return (
        <div className="w-full mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Invoices (Demo)</h1>
            <DataTable data={data} columns={columns} rowHeight={48} headerHeight={48} />
        </div>
    )
} 