"use client"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import data from "./dashboard/data.json"
import { ColumnDef } from "@tanstack/react-table"

export default function Page() {
    const columns: ColumnDef<any>[] = [
        { accessorKey: "header", header: "Başlık" },
        { accessorKey: "type", header: "Tip" },
        { accessorKey: "status", header: "Durum" },
        { accessorKey: "target", header: "Hedef" },
        { accessorKey: "limit", header: "Limit" },
        { accessorKey: "reviewer", header: "Sorumlu" },
    ]
    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards />
                <div className="px-4 lg:px-6">
                    <ChartAreaInteractive />
                </div>
                <DataTable data={data} columns={columns} />
            </div>
        </div>
    )
} 