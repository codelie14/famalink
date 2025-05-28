"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { useLoading } from "@/components/providers/loading-provider"
import { useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { setIsLoading } = useLoading();

  useEffect(() => {
    // Simuler un chargement initial
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [setIsLoading]);

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 h-full">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}