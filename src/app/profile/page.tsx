"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { User, Mail, Calendar, Edit, ArrowLeft, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toBnDigits } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("প্রোফাইল দেখতে প্রথমে লগইন করুন।");
      router.push("/signin");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#07963d]" />
          <p className="text-sm font-medium">প্রোফাইল লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : "U";
  const createdDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString("bn-BD") : toBnDigits("২০২৬");

  return (
    <div className="flex-1 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 hover:text-[#07963d] font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>হোম পেজে ফিরে যান</span>
        </Link>

        {/* Profile Card */}
        <div className="rounded-3xl bg-white border border-gray-200/90 p-6 sm:p-10 shadow-xs space-y-8">
          
          {/* Header & Avatar */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative w-20 h-20 rounded-3xl bg-[#eaf5ec] border-2 border-[#d2e8d7] flex items-center justify-center text-3xl font-bold text-[#07963d] shadow-2xs shrink-0 overflow-hidden ring-4 ring-[#07963d]/10">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "প্রোফাইল ছবি"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{userInitial}</span>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">
                  {user.name || "ব্যবহারকারী"}
                </h1>
                {user.image && (
                  <span className="px-2 py-0.5 rounded-full bg-[#eef6f0] border border-[#cce6d3] text-[11px] font-semibold text-[#07963d]">
                    ভেরিফাইড ফটো
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                বাজার দর ব্যবহারকারী অ্যাকাউন্ট
              </p>
            </div>
          </div>

          {/* User Details Grid */}
          <div className="space-y-3 pt-2">
            
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#f8faf8] border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200/70 flex items-center justify-center text-[#07963d] shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 font-medium leading-none mb-1">
                  পুরো নাম
                </p>
                <p className="text-sm sm:text-base font-semibold text-[#1f2937] truncate">
                  {user.name || "তথ্য পাওয়া যায়নি"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#f8faf8] border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200/70 flex items-center justify-center text-[#07963d] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 font-medium leading-none mb-1">
                  ইমেইল এড্রেস
                </p>
                <p className="text-sm sm:text-base font-semibold text-[#1f2937] truncate">
                  {user.email || "তথ্য পাওয়া যায়নি"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#f8faf8] border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200/70 flex items-center justify-center text-[#07963d] shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 font-medium leading-none mb-1">
                  যোগদানের তারিখ
                </p>
                <p className="text-sm sm:text-base font-semibold text-[#1f2937] truncate">
                  {createdDate}
                </p>
              </div>
            </div>

          </div>

          {/* Challenge C3: Update Information Button */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400 text-center sm:text-left">
              আপনার ব্যক্তিগত তথ্য পরিবর্তন বা সংশোধন করতে নিচের বাটনে চাপ দিন।
            </p>
            <Link
              href="/profile/update"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#07963d] hover:bg-[#068034] text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all shrink-0 w-full sm:w-auto"
            >
              <Edit className="w-4 h-4" />
              <span>তথ্য আপডেট করুন</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
