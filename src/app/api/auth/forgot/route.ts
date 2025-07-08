import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const { email } = await req.json()
    // Demo: OTP gönderildi gibi davran
    if (email) {
        return NextResponse.json({ success: true, message: "OTP gönderildi" })
    }
    return NextResponse.json({ success: false, message: "Email gerekli" }, { status: 400 })
} 