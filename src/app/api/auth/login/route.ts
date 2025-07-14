import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();
    if (!email || !password)
        return NextResponse.json({ error: "Email and password required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    // Session oluştur
    const sessionToken = uuidv4();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 gün
    await prisma.session.create({
        data: {
            userId: user.id,
            token: sessionToken,
            expiresAt,
        },
    });

    // Kullanıcının rolünü bul
    let roleName = "viewer";
    if (user.roleId) {
        const role = await prisma.role.findUnique({ where: { id: user.roleId } });
        if (role) roleName = role.name;
    }
    const res = NextResponse.json({ success: true, role: roleName });
    res.cookies.set("sid", sessionToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "lax",
        expires: expiresAt,
    });
    return res;
}

export async function DELETE(req: NextRequest) {
    const sid = req.cookies.get("sid")?.value;
    if (sid) {
        await prisma.session.deleteMany({ where: { token: sid } });
    }
    const res = NextResponse.json({ success: true });
    res.cookies.set("sid", "", {
        httpOnly: true,
        secure: true,
        path: "/",
        expires: new Date(0),
    });
    return res;
}