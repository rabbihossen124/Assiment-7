"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { User, Mail, Lock, UserPlus, ArrowRight, Loader2 } from "lucide-react";
import { signUp, signIn } from "@/lib/auth-client";
import SocialAuthModal from "@/components/auth/SocialAuthModal";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalProvider, setModalProvider] = useState<"google" | "github" | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      const msg = "অনুগ্রহ করে আপনার নাম, ইমেইল এবং পাসওয়ার্ড প্রদান করুন।";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    if (password.length < 6) {
      const msg = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    try {
      setLoading(true);
      const res = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      if (res?.error) {
        let errorText = "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।";
        const rawMsg = res.error.message || "";
        if (rawMsg.toLowerCase().includes("already") || rawMsg.toLowerCase().includes("exist")) {
          errorText = "এই ইমেইলটি দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট তৈরি করা হয়েছে। অনুগ্রহ করে লগইন করুন।";
        }
        setErrorMsg(errorText);
        toast.error(errorText);
        return;
      }

      // Auto sign-in on registration
      await signIn.email({
        email: email.trim(),
        password: password.trim(),
      });

      toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! স্বাগতম।");
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      console.error("Sign up error:", err);
      const errorText = "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।";
      setErrorMsg(errorText);
      toast.error(errorText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        
        {/* Main Card */}
        <div className="rounded-3xl bg-white border border-gray-200/90 p-6 sm:p-10 shadow-sm space-y-6">
          
          {/* Brand & Heading */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-11 h-11 rounded-2xl bg-[#eef6f0] border border-[#d6e8da] flex items-center justify-center p-1.5 shadow-2xs group-hover:scale-105 transition-transform">
                <Image
                  src="/logo-icon.png"
                  alt="বাজার দর"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-bold tracking-tight text-[#1a2a1d]">
                বাজার দর
              </span>
            </Link>
            <h1 className="text-2xl sm:text-[26px] font-bold text-[#111827] pt-2">
              নতুন অ্যাকাউন্ট তৈরি করুন
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-normal">
              দৈনিক বাজারদর ট্র্যাক করতে সহজে একটি অ্যাকাউন্ট খুলুন
            </p>
          </div>

          {/* Error Banner if any */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm font-medium">
              {errorMsg}
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-[#374151]">
                আপনার পুরো নাম
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="আপনার পুরো নাম লিখুন"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#07963d] focus:ring-2 focus:ring-[#07963d]/20 text-sm text-[#111827] placeholder:text-gray-400 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-[#374151]">
                ইমেইল এড্রেস
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#07963d] focus:ring-2 focus:ring-[#07963d]/20 text-sm text-[#111827] placeholder:text-gray-400 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-[#374151]">
                পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#07963d] focus:ring-2 focus:ring-[#07963d]/20 text-sm text-[#111827] placeholder:text-gray-400 outline-none transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl bg-[#07963d] hover:bg-[#068034] active:bg-[#056d2c] disabled:opacity-70 text-white text-sm sm:text-base font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>অ্যাকাউন্ট তৈরি হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>রেজিস্টার করুন</span>
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Social Login Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-gray-200" />
            <span className="bg-white px-3 text-xs text-gray-400 uppercase tracking-wider font-medium">
              অথবা
            </span>
          </div>

          {/* Social Login Buttons (Google / GitHub) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => setModalProvider("google")}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/80 text-xs sm:text-sm font-semibold text-[#374151] transition-all cursor-pointer shadow-2xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>গুগল</span>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => setModalProvider("github")}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50/80 text-xs sm:text-sm font-semibold text-[#374151] transition-all cursor-pointer shadow-2xs"
            >
              <svg className="w-4 h-4 fill-[#181717]" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>গিটহাব</span>
            </button>
          </div>

          {/* Footer Login Link */}
          <div className="pt-2 text-center text-xs sm:text-sm text-gray-600">
            <span>ইতিমধ্যে অ্যাকাউন্ট আছে? </span>
            <Link
              href="/signin"
              className="text-[#07963d] font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>লগইন করুন</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

      {/* Social Auth Confirmation Modal */}
      {modalProvider && (
        <SocialAuthModal
          isOpen={!!modalProvider}
          provider={modalProvider}
          onClose={() => setModalProvider(null)}
          onSuccess={() => {
            setModalProvider(null);
            router.push("/");
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
