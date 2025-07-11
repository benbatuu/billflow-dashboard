'use client';

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import data from "@/app/dashboard/data.json"
import { Button } from "@/components/ui/button"
// Removed: import easyinvoice from "easyinvoice"

const templates = [
    { key: "modern", label: "Modern" },
    { key: "classic", label: "Classic" },
    { key: "minimal", label: "Minimal" },
]

function ModernInvoice({ invoice }: { invoice: any }) {
    return (
        <div className="bg-white rounded-xl shadow p-8 w-full max-w-2xl mx-auto border border-gray-200">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <div className="text-2xl font-bold">INVOICE</div>
                    <div className="text-sm text-gray-500">#{invoice.number || invoice.id}</div>
                </div>
                <div className="text-right">
                    <div className="font-semibold">{invoice.customer || invoice.reviewer}</div>
                    <div className="text-xs text-gray-400">{invoice.date || "2024-01-01"}</div>
                </div>
            </div>
            <div className="mb-6">
                <div className="flex justify-between text-gray-600 text-sm">
                    <span>Status:</span>
                    <span className="font-medium text-black">{invoice.status}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                    <span>Group:</span>
                    <span>{invoice.group || invoice.type}</span>
                </div>
            </div>
            <div className="border-t pt-6 mt-6 flex justify-between text-lg font-bold">
                <span>Amount</span>
                <span>₺{invoice.amount || invoice.target}</span>
            </div>
        </div>
    )
}

function ClassicInvoice({ invoice }: { invoice: any }) {
    return (
        <div className="bg-white rounded border p-6 w-full max-w-2xl mx-auto font-serif">
            <div className="text-xl font-bold mb-2">FATURA</div>
            <div className="flex justify-between mb-4">
                <div>
                    <div className="text-sm">No: {invoice.number || invoice.id}</div>
                    <div className="text-sm">Tarih: {invoice.date || "2024-01-01"}</div>
                </div>
                <div className="text-right">
                    <div className="font-semibold">{invoice.customer || invoice.reviewer}</div>
                </div>
            </div>
            <div className="mb-4">Durum: <span className="font-semibold">{invoice.status}</span></div>
            <div className="mb-4">Grup: {invoice.group || invoice.type}</div>
            <div className="flex justify-between border-t pt-4 mt-4 text-lg">
                <span>Tutar</span>
                <span>₺{invoice.amount || invoice.target}</span>
            </div>
        </div>
    )
}

function MinimalInvoice({ invoice }: { invoice: any }) {
    return (
        <div className="bg-white rounded-lg border p-4 w-full max-w-xl mx-auto text-sm">
            <div className="font-bold text-lg mb-2">Invoice #{invoice.number || invoice.id}</div>
            <div className="mb-1">Customer: {invoice.customer || invoice.reviewer}</div>
            <div className="mb-1">Date: {invoice.date || "2024-01-01"}</div>
            <div className="mb-1">Status: {invoice.status}</div>
            <div className="mb-1">Group: {invoice.group || invoice.type}</div>
            <div className="border-t pt-3 mt-3 flex justify-between font-semibold">
                <span>Amount</span>
                <span>₺{invoice.amount || invoice.target}</span>
            </div>
        </div>
    )
}

const templateComponents: Record<string, React.FC<{ invoice: any }>> = {
    modern: ModernInvoice,
    classic: ClassicInvoice,
    minimal: MinimalInvoice,
}

export default function InvoiceViewPage() {
    const params = useParams<{ id: string }>()
    const router = useRouter()
    const [selected, setSelected] = React.useState("modern")
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState("")
    const arr = Array.isArray(data) ? data : (data && Array.isArray((data as any).default) ? (data as any).default : [])
    const invoice = arr.find((inv: any) => String(inv.id) === params.id)

    async function handleDownload() {
        setLoading(true)
        setError("")
        // Map invoice data to easyinvoice format
        const doc = {
            "images": {
                // Optional: Add your logo here
                // "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png"
            },
            "sender": {
                "company": "Sample Corp",
                "address": "Sample Street 123",
                "zip": "1234 AB",
                "city": "Sampletown",
                "country": "Samplecountry"
            },
            "client": {
                "company": invoice.customer || invoice.reviewer,
                "address": "Clientstreet 456",
                "zip": "4567 CD",
                "city": "Clientcity",
                "country": "Clientcountry"
            },
            "information": {
                "number": invoice.number || invoice.id,
                "date": invoice.date || "2024-01-01",
                "due-date": "2024-01-15"
            },
            "products": [
                { "quantity": "2", "description": "Test1", "tax": "21", "price": 33.87 },
                { "quantity": "4", "description": "Test2", "tax": "6", "price": 10.45 }
            ],
            "bottom-notice": "Kindly pay your invoice within 15 days.",
            "settings": { "currency": "USD" }
        }
        try {
            const res = await fetch("/api/invoice-pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(doc),
            })
            if (!res.ok) throw new Error("PDF oluşturulamadı.")
            const { pdf } = await res.json()
            // Download PDF
            const link = document.createElement("a")
            link.href = "data:application/pdf;base64," + pdf
            link.download = `invoice-${invoice.number || invoice.id}.pdf`
            link.click()
        } catch (err: any) {
            setError(err.message || "PDF oluşturulamadı.")
        } finally {
            setLoading(false)
        }
    }

    if (!invoice) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="text-2xl font-bold mb-2">Fatura bulunamadı</div>
                <Button variant="outline" onClick={() => router.back()}>Geri Dön</Button>
            </div>
        )
    }

    const Template = templateComponents[selected]

    return (
        <div className="w-full min-h-screen bg-[#f8f8f8] py-10">
            <div className="flex flex-col items-center gap-4 mb-8">
                <div className="flex gap-2">
                    {templates.map(t => (
                        <Button key={t.key} variant={selected === t.key ? "default" : "outline"} onClick={() => setSelected(t.key)}>{t.label}</Button>
                    ))}
                </div>
                <Button variant="secondary" onClick={handleDownload} disabled={loading}>{loading ? "Oluşturuluyor..." : "PDF olarak indir"}</Button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <Template invoice={invoice} />
        </div>
    )
} 