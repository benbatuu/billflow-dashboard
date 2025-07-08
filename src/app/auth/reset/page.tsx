"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ResetPage() {
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")
        try {
            const res = await fetch("/api/auth/reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            })
            if (!res.ok) throw new Error("Şifre sıfırlanamadı")
            setSuccess("Şifreniz başarıyla değiştirildi. Giriş yapabilirsiniz.")
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <form
                onSubmit={handleReset}
                className="w-full max-w-md space-y-6 rounded-lg border p-8 shadow-lg bg-card"
            >
                <h1 className="text-2xl font-bold mb-4">Şifre Sıfırla</h1>
                <Input
                    type="email"
                    placeholder="E-posta"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <Input
                    type="text"
                    placeholder="OTP Kodu"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    required
                />
                <Input
                    type="password"
                    placeholder="Yeni Şifre"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sıfırlanıyor..." : "Şifreyi Sıfırla"}
                </Button>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                {success && <div className="text-green-600 text-sm">{success}</div>}
            </form>
        </div>
    )
} 