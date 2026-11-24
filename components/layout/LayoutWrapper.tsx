"use client"

import { usePathname } from "next/navigation"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { useUser } from "@/components/providers"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user } = useUser()

  // Hide sidebar and header on auth pages OR whenever the user is logged out
  if (!user || pathname === "/login" || pathname === "/signup") {
    return <main className="flex min-h-screen w-full flex-col">{children}</main>
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
