import type { ReactNode } from "react"
import { Providers } from "@/app/providers"
import "@/app/globals.css"

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

export const metadata = {
      generator: 'v0.app'
    };
