import Link from "next/image";
import Image from "next/image";
import { AlertCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto w-full bg-[#eaf4ec] border-t border-[#d6e7da] text-[#1c2c1e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left Side: Brand and Tagline */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#d6e7da] flex items-center justify-center p-1.5 shadow-2xs shrink-0">
              <Image
                src="/logo-icon.png"
                alt="বাজার দর"
                width={28}
                height={28}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-base sm:text-lg font-bold text-[#142617]">
                বাজার দর <span className="font-normal text-[#4a5e4e]">— প্রয়োজনীয় পণ্যের দাম এক নজরে।</span>
              </p>
              <p className="text-xs text-[#5a6e5e] mt-0.5">
                © ২০২৬ বাজার দর (BazarDor)। সর্বস্বত্ব সংরক্ষিত।
              </p>
            </div>
          </div>

          {/* Right Side: Disclaimer Note (Exact requirement) */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/80 border border-[#d6e7da] text-xs sm:text-sm text-[#4a5e4e] shadow-2xs text-center md:text-right">
            <AlertCircle className="w-4 h-4 text-[#07963d] shrink-0 hidden sm:inline" />
            <p className="italic font-medium">
              “সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।”
            </p>
          </div>

        </div>

      </div>
    </footer>
  );
}
