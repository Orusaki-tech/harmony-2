import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HARMONY - Human Analytics, Reporting & Onboarding Network",
  description: "Modern HR automation platform for African SMEs - Human Analytics, Reporting & Onboarding Network",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <SidebarProvider defaultOpen={true}>
          <ErrorBoundary>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <SidebarInset className="flex-1 flex flex-col overflow-hidden">{children}</SidebarInset>
            </div>
          </ErrorBoundary>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  )
}
