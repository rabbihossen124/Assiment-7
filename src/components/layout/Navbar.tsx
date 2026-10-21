"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, LogIn, UserPlus, LogOut, User as UserIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { getTodayBnDate } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";
import { useSession, signOut } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>("");
  const { data: session } = useSession();

  useEffect(() => {
    setCurrentDate(getTodayBnDate());
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছে।");
      setMobileMenuOpen(false);
    } catch (err) {
      console.error("Sign out error:", err);
      toast.error("সাইন আউট করতে সমস্যা হয়েছে।");
    }
  };

  const isActiveCategory = (slug: string) => {
    if (slug === "") {
      return pathname === "/" || pathname === "/#সব-পণ্য";
    }
    return pathname === `/categories/${slug}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#e2ede4] shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      {/* Top Navbar Row: Logo, Date & Auth Buttons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Brand Logo & Bangla Date */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="বাজার দর হোমপেজ"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#eef6f0] border border-[#d6e8da] flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition-transform">
              <Image
                src="/logo-icon.png"
                alt="বাজার দর লোগো"
                width={36}
                height={36}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#1a2a1d] group-hover:text-[#07963d] transition-colors">
                  বাজার দর
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#e8f5ec] text-[#07963d] border border-[#cde8d3]">
                  লাইভ
                </span>
              </div>
              <p
                className="text-xs text-[#5a6e5e] font-medium tracking-wide flex items-center gap-1.5 mt-0.5"
                suppressHydrationWarning
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#07963d] animate-pulse inline-block" />
                {currentDate || "দৈনিক নিত্যপ্রয়োজনীয় বাজারদর"}
              </p>
            </div>
          </Link>

          {/* Right: Auth Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {session?.user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-[#203323] hover:text-[#07963d] bg-[#f8fbf8] border border-[#d6e5d9] transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-[#07963d]/10 text-[#07963d] flex items-center justify-center font-bold text-xs overflow-hidden ring-1 ring-[#07963d]/20">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "প্রোফাইল ছবি"}
                        className="w-full h-full object-cover"
                      />
                    ) : session.user.name ? (
                      session.user.name.charAt(0).toUpperCase()
                    ) : (
                      <UserIcon className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className="max-w-[120px] truncate">{session.user.name || "প্রোফাইল"}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200 transition-all cursor-pointer"
                  aria-label="লগআউট"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>সাইন আউট</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-[#203323] hover:text-[#07963d] bg-white border border-[#d6e5d9] hover:border-[#07963d] hover:bg-[#f7fbf8] shadow-sm transition-all duration-150"
                >
                  <LogIn className="w-4 h-4 text-[#07963d]" />
                  <span>সাইন ইন</span>
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#07963d] hover:bg-[#068034] active:bg-[#056b2b] shadow-sm hover:shadow transition-all duration-150"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>সাইন আপ</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#203323] hover:text-[#07963d] hover:bg-[#eef6f0] focus:outline-none"
              aria-label="মেনু খুলুন"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Second Row: Category Navigation Links (Desktop & Tablet) */}
      <div className="hidden sm:block border-t border-[#e2ede4] bg-[#f8fbf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="ক্যাটাগরি নেভিগেশন"
            className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none"
          >
            {CATEGORIES.map((cat) => {
              const active = isActiveCategory(cat.slug);
              const href = cat.slug === "" ? "/" : `/categories/${cat.slug}`;

              return (
                <Link
                  key={cat.id}
                  href={href}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                    active
                      ? "bg-[#07963d] text-white shadow-sm shadow-[#07963d]/20 font-semibold"
                      : "text-[#334637] hover:text-[#07963d] hover:bg-white bg-white/70 border border-[#dce8dd]/70"
                  }`}
                >
                  <span className="text-sm leading-none">{cat.icon}</span>
                  <span>{cat.nameBn}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#e2ede4] bg-white px-4 pt-3 pb-5 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#5a6e5e] mb-2">
              ক্যাটাগরি সমূহ
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => {
                const active = isActiveCategory(cat.slug);
                const href = cat.slug === "" ? "/" : `/categories/${cat.slug}`;

                return (
                  <Link
                    key={cat.id}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      active
                        ? "bg-[#07963d] text-white font-semibold"
                        : "text-[#203323] bg-[#f8fbf8] hover:bg-[#eef6f0] hover:text-[#07963d] border border-[#e2ede4]"
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.nameBn}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-[#e2ede4] flex flex-col gap-2">
            {session?.user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-[#203323] bg-[#f8fbf8] border border-[#d6e5d9]"
                >
                  <div className="w-5 h-5 rounded-full bg-[#07963d]/10 text-[#07963d] flex items-center justify-center font-bold text-[10px] overflow-hidden ring-1 ring-[#07963d]/20 shrink-0">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "প্রোফাইল ছবি"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-3.5 h-3.5 text-[#07963d]" />
                    )}
                  </div>
                  <span>{session.user.name || "প্রোফাইল"}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 text-center"
                >
                  <LogOut className="w-4 h-4" />
                  <span>সাইন আউট</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-[#203323] bg-[#f8fbf8] hover:bg-[#eef6f0] border border-[#d6e5d9]"
                >
                  <LogIn className="w-4 h-4 text-[#07963d]" />
                  <span>সাইন ইন</span>
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#07963d] hover:bg-[#068034] text-center"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>সাইন আপ</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
