import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";

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
        {/* Wrap ONLY inside the body with SessionWrapper */}
        <SessionWrapper>
          <nav className="w-full bg-white shadow-md py-4 px-6 flex items-center justify-between">
            <h1 className="text-xl font-bold">Yojana Finder 2.0</h1>

            <div className="flex gap-6 text-sm font-medium">
              <a href="/" className="hover:text-blue-600">
                Home
              </a>
              <a href="/login" className="hover:text-blue-600">
                Login
              </a>
              <a href="/register" className="hover:text-blue-600">
                Register
              </a>
              <a href="/dashboard" className="hover:text-blue-600">
                Dashboard
              </a>
            </div>
          </nav>

          <main className="pt-6">{children}</main>
        </SessionWrapper>
      </body>
    </html>
  );
}
