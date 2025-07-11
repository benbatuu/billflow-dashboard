"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthProvider";

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { login, isAuthenticated } = useAuth();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        // Eğer localStorage'da token varsa veya context'te authenticated ise
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token || isAuthenticated) {
            router.replace("/dashboard");
        } else {
            setChecking(false);
        }
    }, [router, isAuthenticated]);

    if (checking) {
        // Eğer token varsa ve redirect yapılacaksa, hiç progress bar veya loading gösterme
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            })
            if (!res.ok) throw new Error("Giriş başarısız")
            const data = await res.json()
            // Token'ı 'Bearer ' prefix'iyle kaydet
            login(`Bearer ${data.token}`)
            router.push("/dashboard")
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-6 rounded-lg border p-8 shadow-lg bg-card"
            >
                <h1 className="text-2xl font-bold mb-4">Giriş Yap</h1>
                <Input
                    type="email"
                    placeholder="E-posta"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                </Button>
                <div className="flex justify-between text-sm mt-2">
                    <a href="/auth/forgot" className="text-primary hover:underline">Şifremi Unuttum</a>
                    <a href="https://kayit.seninlinkin.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Kayıt Ol</a>
                </div>
            </form>
        </div>
    )
} 