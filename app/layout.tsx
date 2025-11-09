import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Providers } from "@/app/providers"
import "@/app/globals.css"

export const metadata: Metadata = {
  title: "لوحة تحكم عطور الشدا - Chada Admin Dashboard",
  description: "نظام إدارة عطور الشدا - Chada Perfumes Admin Panel",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
