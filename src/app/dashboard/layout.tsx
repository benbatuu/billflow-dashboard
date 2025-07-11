'use client';

import { AuthProvider, useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "../globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

function DashboardGuard({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, loading } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (!loading && !isLoggedIn) {
            router.replace("/auth/login");
        }
    }, [isLoggedIn, loading, router]);
    if (loading || !isLoggedIn) return null;
    return <>{children}</>;
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <DashboardGuard>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <SidebarProvider
                        style={{
                            "--sidebar-width": "calc(var(--spacing) * 72)",
                            "--header-height": "calc(var(--spacing) * 12)",
                        } as React.CSSProperties}
                    >
                        <AppSidebar variant="inset" />
                        <SidebarInset>
                            <SiteHeader />
                            {children}
                        </SidebarInset>
                    </SidebarProvider>
                </ThemeProvider>
            </DashboardGuard>
        </AuthProvider>
    );
} 