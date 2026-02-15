import Link from "next/link"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes"
import ThemeToggle from "./reusables/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* خط Cairo - أفضل خط عربي */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="min-h-screen bg-background antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold">
                حجز مواعيد
              </Link>

              <nav className="flex gap-6 items-center">
                <Link href="/">
                  <Button variant="ghost">احجز موعد</Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost">لوحة التحكم</Button>
                </Link>
                <ThemeToggle />
              </nav>
            </div>
          </header>

          <main>{children}</main>

          {/* Footer */}
          <footer className="border-t bg-muted/40 py-6 mt-auto">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              <p>
                © {new Date().getFullYear()} عبد الرحمن خضر (خضر) – Full-Stack Developer
              </p>
              <p className="mt-1">
                مشروع بورتفوليو: نظام حجز مواعيد
                {" • "}
                <Link
                  href="https://github.com/khadrx/booking-frontend-portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View on GitHub
                </Link>
              </p>
              <p className="mt-1 text-xs">
                Built with Next.js, shadcn/ui, FastAPI & PostgreSQL
              </p>
            </div>
          </footer>
          
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
