import { NextRequest, NextResponse } from "next/server"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

export async function POST(req: NextRequest) {
    try {
        const doc = await req.json()
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create()
        const page = pdfDoc.addPage([595, 842]) // A4 size
        const { width, height } = page.getSize()

        // Fonts
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

        // Header
        page.drawText("INVOICE", {
            x: 40,
            y: height - 60,
            size: 28,
            font: boldFont,
            color: rgb(0.1, 0.1, 0.1),
        })

        // Sender
        page.drawText("From:", { x: 40, y: height - 100, size: 12, font: boldFont })
        page.drawText(doc.sender?.company || "", { x: 90, y: height - 100, size: 12, font })
        page.drawText(doc.sender?.address || "", { x: 90, y: height - 115, size: 12, font })
        page.drawText(doc.sender?.city || "", { x: 90, y: height - 130, size: 12, font })
        page.drawText(doc.sender?.country || "", { x: 90, y: height - 145, size: 12, font })

        // Client
        page.drawText("To:", { x: 320, y: height - 100, size: 12, font: boldFont })
        page.drawText(doc.client?.company || "", { x: 360, y: height - 100, size: 12, font })
        page.drawText(doc.client?.address || "", { x: 360, y: height - 115, size: 12, font })
        page.drawText(doc.client?.city || "", { x: 360, y: height - 130, size: 12, font })
        page.drawText(doc.client?.country || "", { x: 360, y: height - 145, size: 12, font })

        // Invoice Info
        page.drawText(`Invoice No: ${doc.information?.number || ""}`, { x: 40, y: height - 180, size: 12, font })
        page.drawText(`Date: ${doc.information?.date || ""}`, { x: 40, y: height - 195, size: 12, font })
        page.drawText(`Due: ${doc.information?.['due-date'] || ""}`, { x: 40, y: height - 210, size: 12, font })

        // Table Header
        let tableY = height - 250
        page.drawText("Description", { x: 40, y: tableY, size: 12, font: boldFont })
        page.drawText("Qty", { x: 250, y: tableY, size: 12, font: boldFont })
        page.drawText("Price", { x: 320, y: tableY, size: 12, font: boldFont })
        page.drawText("Tax", { x: 400, y: tableY, size: 12, font: boldFont })
        page.drawText("Total", { x: 470, y: tableY, size: 12, font: boldFont })
        tableY -= 20

        // Table Rows
        let grandTotal = 0
        if (Array.isArray(doc.products)) {
            for (const p of doc.products) {
                const qty = Number(p.quantity) || 1
                const price = Number(p.price) || 0
                const tax = Number(p.tax) || 0
                const total = qty * price * (1 + tax / 100)
                grandTotal += total
                page.drawText(p.description || "", { x: 40, y: tableY, size: 12, font })
                page.drawText(String(qty), { x: 250, y: tableY, size: 12, font })
                page.drawText(price.toFixed(2), { x: 320, y: tableY, size: 12, font })
                page.drawText(tax.toFixed(2) + "%", { x: 400, y: tableY, size: 12, font })
                page.drawText(total.toFixed(2), { x: 470, y: tableY, size: 12, font })
                tableY -= 18
            }
        }

        // Grand Total
        tableY -= 10
        page.drawText("Grand Total:", { x: 400, y: tableY, size: 14, font: boldFont })
        page.drawText(grandTotal.toFixed(2), { x: 470, y: tableY, size: 14, font: boldFont })

        // Bottom Notice
        if (doc["bottom-notice"]) {
            page.drawText(doc["bottom-notice"], { x: 40, y: 60, size: 10, font, color: rgb(0.4, 0.4, 0.4) })
        }

        // Serialize PDF
        const pdfBytes = await pdfDoc.save()
        const pdfBase64 = Buffer.from(pdfBytes).toString("base64")
        return NextResponse.json({ pdf: pdfBase64 })
    } catch (e) {
        return NextResponse.json({ error: (e as Error).message }, { status: 500 })
    }
} 