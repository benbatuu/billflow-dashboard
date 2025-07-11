'use client'

import "../globals.css";
import { AuthProvider, useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, loading } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if (!loading && isLoggedIn) {
            router.replace("/dashboard");
        }
    }, [isLoggedIn, loading, router]);
    if (loading) return null;
    if (isLoggedIn) return null;
    return <>{children}</>;
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AuthGuard>{children}</AuthGuard>
        </AuthProvider>
    );
} 