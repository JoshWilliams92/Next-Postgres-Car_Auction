import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { initializeSchema } from "./lib/db";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Car Auction',
    default: 'Car Auction',
  },
  description: 'Find and bid on cars from trusted sellers. Create auctions, manage your garage, and discover your next vehicle.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize database schema on every layout render
  // This is idempotent (CREATE TABLE IF NOT EXISTS) so it's safe to call repeatedly
  try {
    await initializeSchema();
  } catch (error) {
    console.error('Database initialization error:', error);
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
