"use client";
import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<any>[] = [
    { accessorKey: "number", header: "Fatura No" },
    { accessorKey: "customer", header: "Müşteri" },
    { accessorKey: "amount", header: "Tutar", cell: info => `₺${info.getValue()}` },
    { accessorKey: "status", header: "Durum" },
    { accessorKey: "group", header: "Grup" },
    { accessorKey: "date", header: "Tarih" },
];

export function InvoicesTable({ data }: { data: any[] }) {
    return <DataTable data={data} columns={columns} />;
} 