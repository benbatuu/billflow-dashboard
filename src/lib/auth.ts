import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function getSessionUser(req: NextRequest) {
    const sid = req.cookies.get("sid")?.value;
    if (!sid) return null;
    const session = await prisma.session.findUnique({
        where: { token: sid },
        include: { user: true },
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