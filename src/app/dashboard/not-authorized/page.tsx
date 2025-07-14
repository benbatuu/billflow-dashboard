'use client'
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotAuthorizedPage() {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
            <h1 className="text-3xl font-bold mb-4 text-red-600">Not Authorized</h1>
            <p className="text-muted-foreground mb-6">You do not have permission to view this page.</p>
            <Button onClick={() => router.push("/")}>Go to Dashboard</Button>
        </div>
    );
} 