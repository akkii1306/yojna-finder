import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AuthNav from "@/components/AuthNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yojana Finder 2.0",
  description: "AI-powered Yojana recommendation system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-gray-50 min-h-screen">
        <SessionWrapper>
          <nav className="w-full bg-white border-b shadow-sm">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
              
              {/* LOGO */}
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Yojana Finder 2.0
              </Link>

              {/* NAV LINKS */}
              <div className="flex items-center gap-6 text-sm font-medium">
                <Link href="/" className="hover:text-blue-600">
                  Home
                </Link>

                <Link href="/yojanas" className="hover:text-blue-600">
                  Yojanas
                </Link>

                <Link href="/dashboard" className="hover:text-blue-600">
                  Dashboard
                </Link>

                {/* AUTH BUTTONS (Login/Register OR Logout) */}
                <AuthNav />
              </div>
            </div>
          </nav>

          {/* MAIN CONTENT */}
          <main className="pt-6">{children}</main>
        </SessionWrapper>
      </body>
    </html>
  );
}
