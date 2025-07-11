"use client";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";

export function GlobalProgress({ logo = "/next.svg" }: { logo?: string }) {
    const [progress, setProgress] = useState(0);
    const [mounted, setMounted] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const { resolvedTheme } = useTheme();

    // Hydration için mounted state
    useEffect(() => {
        setMounted(true);
    }, []);

    // Theme fallback: Eğer resolvedTheme undefined ise localStorage'dan oku
    let effectiveTheme = resolvedTheme;
    if (!effectiveTheme && typeof window !== "undefined") {
        effectiveTheme = localStorage.getItem("theme") || "light";
    }
    const isDark = effectiveTheme === "dark";

    useEffect(() => {
        setProgress(0);
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setProgress(prev => {
                if (prev < 90) return prev + Math.random() * 10;
                return prev;
            });
        }, 120);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setProgress(100);
        };
    }, []);

    useEffect(() => {
        if (progress >= 100 && intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }, [progress]);

    // Theme henüz yüklenmemişse loading gösterme
    if (!mounted) {
        return (
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 9999,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#ffffff",
                }}
            >
                <img
                    src={logo}
                    alt="Logo"
                    style={{ height: 48, marginBottom: 32 }}
                />
                <div
                    style={{
                        width: 256,
                        height: 10,
                        backgroundColor: "#f5f5f5",
                        borderRadius: 4,
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            width: `${Math.min(progress, 100)}%`,
                            height: "100%",
                            backgroundColor: "#000000",
                            borderRadius: 4,
                            transition: "width 0.2s cubic-bezier(.4,1,.7,1)",
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isDark ? "#000000" : "#ffffff",
                transition: "background-color 0.3s ease",
            }}
        >
            {/* Logo */}
            <img
                src={logo}
                alt="Logo"
                style={{
                    height: 48,
                    marginBottom: 32,
                    filter: isDark ? "invert(1) brightness(0.9)" : "none",
                    transition: "filter 0.3s ease"
                }}
            />

            {/* Progress Bar Container */}
            <div
                style={{
                    width: 256,
                    height: 10,
                    backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5",
                    borderRadius: 6,
                    overflow: "hidden",
                    position: "relative",
                    transition: "background-color 0.3s ease",
                }}
            >
                {/* Progress Bar */}
                <div
                    style={{
                        width: `${Math.min(progress, 100)}%`,
                        height: "100%",
                        backgroundColor: isDark ? "#ffffff" : "#000000",
                        borderRadius: 6,
                        transition: "width 0.2s cubic-bezier(.4,1,.7,1), background-color 0.3s ease",
                        boxShadow: isDark
                            ? "0 0 8px rgba(255,255,255,0.3)"
                            : "0 0 8px rgba(0,0,0,0.2)",
                    }}
                />

                {/* Progress Glow Effect */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: `${Math.min(progress, 100)}%`,
                        height: "100%",
                        background: isDark
                            ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
                            : "linear-gradient(90deg, transparent, rgba(0,0,0,0.3), transparent)",
                        borderRadius: 6,
                        animation: progress < 100 ? "shimmer 2s infinite" : "none",
                    }}
                />
            </div>

            {/* Progress Text */}
            <div
                style={{
                    marginTop: 16,
                    fontSize: 14,
                    color: isDark ? "#a0a0a0" : "#666666",
                    fontWeight: 500,
                    transition: "color 0.3s ease",
                }}
            >
                {Math.round(progress)}%
            </div>

            {/* Shimmer Animation */}
            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}