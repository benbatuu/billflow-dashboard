import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const { email, password } = await req.json()
    // Demo amaçlı sabit kullanıcı
    if (email === "a@b.com" && password === "123") {
        return NextResponse.json({ success: true, token: "demo-token" })
    }
    return NextResponse.json({ success: false, message: "Geçersiz giriş" }, { status: 401 })
} 