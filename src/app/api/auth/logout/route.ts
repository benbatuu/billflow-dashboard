import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
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