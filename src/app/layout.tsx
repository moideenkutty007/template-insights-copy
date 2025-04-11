import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import React from "react"
import "./globals.css"
import { siteConfig } from "./siteConfig"

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: ["team activity", "capacity management", "employee efficiency", "project profitability", "reporting"],
  authors: [
    {
      name: "Value Added Vault",
      url: siteConfig.url,
    },
  ],
  creator: "Value Added Vault",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.className} overflow-x-hidden overflow-y-scroll scroll-auto bg-gray-50 antialiased selection:bg-blue-100 selection:text-blue-700 dark:bg-gray-950`}
      >
        <ThemeProvider
          defaultTheme="system"
          disableTransitionOnChange
          attribute="class"
        >
          <NuqsAdapter>
            <div>{children}</div>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  )
}
