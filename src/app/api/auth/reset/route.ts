import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const { email, otp, newPassword } = await req.json()
    // Demo: OTP ve email kontrolü
    if (email && otp === "123456" && newPassword) {
        return NextResponse.json({ success: true, message: "Şifre değiştirildi" })
    }
    return NextResponse.json({ success: false, message: "Geçersiz bilgi" }, { status: 400 })
} 