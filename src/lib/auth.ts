import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { cookies as getCookies, type ReadonlyRequestCookies } from "next/headers";

export async function getSessionUser(req: NextRequest) {
    const sid = req.cookies.get("sid")?.value;
    if (!sid) return null;
    const session = await prisma.session.findUnique({
        where: { token: sid },
        include: { user: { include: { role: true } } },
    });
    if (!session || session.expiresAt < new Date()) return null;
    return session.user;
}

// Hem NextRequest hem de ReadonlyRequestCookies ile çalışabilen fonksiyon
export async function getUserFromRequest(
    reqOrCookies?: NextRequest | ReadonlyRequestCookies
) {
    let sid: string | undefined;
    if (!reqOrCookies) {
        // Server component'te parametre verilmezse next/headers'dan al
        sid = getCookies().get("sid")?.value;
    } else if (typeof (reqOrCookies as NextRequest).cookies?.get === "function") {
        // NextRequest
        sid = (reqOrCookies as NextRequest).cookies.get("sid")?.value;
    } else if (typeof (reqOrCookies as ReadonlyRequestCookies).get === "function") {
        // ReadonlyRequestCookies
        sid = (reqOrCookies as ReadonlyRequestCookies).get("sid")?.value;
    }
    if (!sid) return null;
    const session = await prisma.session.findUnique({
        where: { token: sid },
        include: { user: { include: { role: true } } },
    });
    if (!session || session.expiresAt < new Date()) return null;
    return session.user;
}

export async function logout() {
    await fetch("/api/auth/login", { method: "DELETE" });
    // Burada me servisini tekrar çağırmıyoruz, sadece session siliniyor.
}

export async function apiFetch(url: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    return fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: token || "",
        },
    });
} 