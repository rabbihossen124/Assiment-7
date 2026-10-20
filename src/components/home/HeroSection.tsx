"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getTodayBnDate } from "@/lib/utils";

export default function HeroSection() {
  const [todayDate, setTodayDate] = useState<string>("মঙ্গলবার, ৬ অক্টোবর, ২০২৬");

  useEffect(() => {
    const liveDate = getTodayBnDate();
    if (liveDate) setTodayDate(liveDate);
  }, []);

  return (
    <section aria-label="হিরো ব্যানার" className="w-full">
      <div className="relative w-full rounded-3xl bg-white border border-gray-200/90 p-6 sm:p-10 lg:p-12 shadow-xs overflow-hidden">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-4 sm:space-y-5">
            
            {/* Eyebrow date badge matching Figma */}
            <div
              className="inline-flex items-center px-3.5 py-1 rounded-full text-xs sm:text-sm font-medium bg-[#eaf5ec] text-[#07963d] border border-[#d2e8d7]"
              suppressHydrationWarning
            >
              {todayDate}
            </div>

            {/* Main Heading matching Figma */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#111827] leading-[1.25]">
              আজকের বাজারের দাম এক নজরে
            </h1>

            {/* Subtitle matching Figma */}
            <p className="text-sm sm:text-base text-[#4b5563] max-w-xl font-normal leading-relaxed">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
            </p>

            {/* Primary CTA button matching Figma */}
            <div className="pt-2">
              <a
                href="#সব-পণ্য"
                className="inline-flex items-center justify-center px-6 py-2.5 sm:py-3 rounded-xl bg-[#07963d] hover:bg-[#068034] active:bg-[#056d2c] text-white text-sm sm:text-base font-semibold shadow-xs hover:shadow transition-all duration-150"
                aria-label="সব পণ্য দেখুন"
              >
                সব পণ্য দেখুন
              </a>
            </div>

          </div>

          {/* Right Hero Image Column */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md aspect-[4/3] flex items-center justify-center">
              <Image
                src="/bazar-hero.png"
                alt="বাজার দর হিরো ব্যানার"
                width={420}
                height={320}
                priority
                className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.06)]"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
