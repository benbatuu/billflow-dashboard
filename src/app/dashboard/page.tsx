import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable, DataTableColumn } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import data from "./data.json"

const columns: DataTableColumn[] = [
    { key: "header", header: "Başlık" },
    { key: "type", header: "Tip" },
    { key: "status", header: "Durum" },
    { key: "target", header: "Hedef" },
    { key: "limit", header: "Limit" },
    { key: "reviewer", header: "Sorumlu" },
]

export default function Page() {
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
