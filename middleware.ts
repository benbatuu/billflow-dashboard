import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot",
    "/auth/reset",
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Auth sayfalarına erişim serbest
    if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Sadece dashboard altı route'larda koruma
    if (pathname.startsWith("/dashboard")) {
        const refreshToken = request.cookies.get("refreshToken")?.value;
        if (!refreshToken) {
            const loginUrl = new URL("/auth/login", request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
}; 