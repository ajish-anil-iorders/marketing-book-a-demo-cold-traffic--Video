import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Turn Online Orders Into Real Profit",
  description:
    "Stop paying commission to third-party apps. Book a free demo and see how iOrders helps restaurants keep 100% of every online order.",
  keywords: [
    "iOrders",
    "restaurant online ordering",
    "direct ordering system",
    "book a demo",
    "restaurant commission savings",
    "replace Uber Eats",
    "replace DoorDash",
    "restaurant ordering platform",
  ],
  openGraph: {
    title: "iOrders — Book a Demo | Direct Ordering for Restaurants",
    description:
      "Replace Uber Eats and DoorDash with your own direct ordering system. Keep 100% of every order.",
    type: "website",
    siteName: "iOrders",
  },
  twitter: {
    card: "summary_large_image",
    title: "iOrders — Book a Demo | Direct Ordering for Restaurants",
    description:
      "Replace Uber Eats and DoorDash with your own direct ordering system. Keep 100% of every order.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
