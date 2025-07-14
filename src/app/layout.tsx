'use client'

import "./globals.css";
import { GlobalProgress } from "@/components/GlobalProgress";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Not authorized sayfasında progress gösterme
    if (pathname === "/dashboard/not-authorized") {
      setLoading(false);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 800); // min 800ms loading
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <html lang="en">
      <body>
        {loading ? <GlobalProgress /> : children}
      </body>
    </html>
  );
}
