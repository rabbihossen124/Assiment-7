import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/providers/ToastProvider";
import Navbar from "@/components/layout/Navbar";
import PriceTicker from "@/components/layout/PriceTicker";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে",
  description: "বাংলাদেশের বিভিন্ন বাজারের নিত্যপ্রয়োজনীয় পণ্যের নির্ভরযোগ্য ও হালনাগাদ বাজারদর। চাল, ডাল, তেল, সবজি, মাছ, মাংসের আজকের সঠিক দাম জানুন।",
  icons: {
    icon: "/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={hindSiliguri.variable}>
      <body className="min-h-screen flex flex-col font-sans bg-[#FAFAF9] text-gray-900 antialiased selection:bg-emerald-500 selection:text-white">
        <ToastProvider />
        <Navbar />
        <PriceTicker />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
