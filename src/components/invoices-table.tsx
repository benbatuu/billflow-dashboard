"use client"

import * as React from "react"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { t } from "@/lib/i18n"
import { ColumnDef } from "@tanstack/react-table"

export type Invoice = {
    id: number
    number: string
    customer: string
    amount: number
    status: string
    group: string
    date: string
}

type InvoicesTableProps = {
    data: Invoice[]
    onEdit: (invoice: Invoice) => void
    onDelete: (invoice: Invoice) => void
    extraColumns?: ColumnDef<Invoice>[]
}

export function InvoicesTable({ data, onEdit, onDelete, extraColumns = [] }: InvoicesTableProps) {
    const [thead, setThead] = React.useState({
        number: "",
        customer: "",
        amount: "",
        status: "",
        actions: ""
    })

    React.useEffect(() => {
        Promise.all([
            t("invoices.number"),
            t("invoices.customer"),
            t("invoices.amount"),
            t("invoices.status"),
            t("invoices.actions")
        ]).then(([number, customer, amount, status, actions]) => {
            setThead({ number, customer, amount, status, actions })
        })
    }, [])

    const baseColumns: ColumnDef<Invoice>[] = [
        {
            accessorKey: "number",
            header: thead.number,
            cell: info => info.getValue(),
        },
        {
            accessorKey: "customer",
            header: thead.customer,
            cell: info => info.getValue(),
        },
        {
            accessorKey: "amount",
            header: thead.amount,
            cell: info => `$${info.getValue()}`,
        },
        {
            accessorKey: "status",
            header: thead.status,
            cell: info => {
                const status = info.getValue() as string
                return (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${status === "paid" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : status === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}`}>{status}</span>
                )
            },
        },
        {
            id: "actions",
            header: thead.actions,
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => onEdit(row.original)}>Düzenle</Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(row.original)}>Sil</Button>
                </div>
            ),
        },
    ]

    const columns = React.useMemo<ColumnDef<Invoice>[]>(
        () => [
            ...baseColumns.slice(0, 2),
            ...(extraColumns || []),
            ...baseColumns.slice(2)
        ],
        [thead, onEdit, onDelete, extraColumns]
    )

    return (
        <DataTable data={data} columns={columns} />
    )
} 