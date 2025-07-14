import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
            <h1 className="text-3xl font-bold mb-4 text-destructive">Something went wrong</h1>
            <p className="text-muted-foreground mb-6">An unexpected error occurred. Please try again later.</p>
            <Button onClick={() => router.push("/")}>Go to Dashboard</Button>
        </div>
    );
} 