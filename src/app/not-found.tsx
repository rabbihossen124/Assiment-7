import Link from "next/link";
import { ArrowLeft, Home, Search, Layers, RefreshCw } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

export const metadata = {
  title: "৪০৪ — পাতাটি খুঁজে পাওয়া যায়নি | বাজার দর",
  description: "দুঃখিত, অনুরোধকৃত পাতাটি খুঁজে পাওয়া যায়নি। বাজার দর হোম পেজে ফিরে যান।",
};

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl mx-auto text-center space-y-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Visual 404 Illustration Badge */}
        <div className="relative inline-block">
          {/* Background glowing blur */}
          <div className="absolute inset-0 bg-[#07963d]/15 blur-2xl rounded-full scale-125"></div>
          
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-3xl bg-white border border-[#d6e8da] shadow-lg flex flex-col items-center justify-center p-4">
            <span className="text-4xl sm:text-5xl select-none">🛒</span>
            <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-[#07963d] text-white flex items-center justify-center shadow-md">
              <Search className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Heading & Friendly Explanation */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#eef6f0] border border-[#d6e8da] text-xs sm:text-sm font-bold text-[#07963d]">
            <span>ভুল ঠিকানা (Error 404)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            ৪০৪ — পাতাটি খুঁজে পাওয়া যায়নি!
          </h1>

          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto leading-relaxed">
            দুঃখিত, আপনি যে লিংকটিতে প্রবেশ করতে চেয়েছেন তা হয়তো পরিবর্তিত হয়েছে, মুছে ফেলা হয়েছে অথবা ঠিকানাটি টাইপ করতে ভুল হয়েছে।
          </p>
        </div>

        {/* Primary CTA Buttons (Requirement: "হোম পেজে ফিরে যান") */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#07963d] hover:bg-[#068034] active:bg-[#056d2c] text-white text-sm sm:text-base font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>হোম পেজে ফিরে যান</span>
          </Link>

          <Link
            href="/categories"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm sm:text-base font-semibold shadow-2xs hover:border-gray-300 transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4 text-gray-500" />
            <span>সব ক্যাটাগরি ব্রাউজ করুন</span>
          </Link>
        </div>

        {/* Popular Categories Shortcut List */}
        <div className="pt-6 border-t border-gray-200/80 space-y-3">
          <p className="text-xs sm:text-sm font-semibold text-gray-600">
            জনপ্রিয় ক্যাটাগরিগুলোর আজকের দর যাচাই করুন:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.filter((c) => c.slug).map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#eef6f0] border border-gray-200 hover:border-[#07963d]/40 text-xs sm:text-sm text-gray-700 hover:text-[#07963d] font-medium shadow-2xs transition-all"
              >
                <span>{cat.icon}</span>
                <span>{cat.nameBn}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
