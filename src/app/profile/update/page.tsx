"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { User, ArrowLeft, Loader2, Save, Image as ImageIcon, Upload, Sparkles, Check } from "lucide-react";
import { useSession, updateUser } from "@/lib/auth-client";

const AVATAR_PRESETS = [
  {
    id: "shopper_1",
    name: "স্মার্ট ক্রেতা",
    url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    id: "shopper_2",
    name: "বাজার বিশ্লেষক",
    url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    id: "shopper_3",
    name: "সচেতন ক্রেতা",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    id: "shopper_4",
    name: "সুপার ক্রেতা",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80",
  },
];

export default function ProfileUpdatePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("তথ্য পরিবর্তন করতে প্রথমে লগইন করুন।");
      router.push("/signin");
    } else if (session?.user) {
      if (session.user.name) setName(session.user.name);
      if (session.user.image) setImage(session.user.image);
    }
  }, [session, isPending, router]);

  // Handle local file upload (JPG, PNG, WebP) with auto-resizing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("অনুগ্রহ করে একটি ছবি ফাইল (JPG, PNG ইত্যাদি) নির্বাচন করুন।");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("ছবির আকার সর্বোচ্চ ৮ মেগাবাইট (8MB) হতে পারবে।");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_DIM = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.85);
          setImage(compressed);
          toast.success("ছবি সফলভাবে লোড হয়েছে! এবার নিচের বাটনে চাপ দিয়ে সংরক্ষণ করুন।");
        } else {
          setImage(event.target?.result as string);
          toast.success("ছবি লোড হয়েছে!");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      const msg = "অনুগ্রহ করে আপনার নাম প্রদান করুন।";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    try {
      setSaving(true);
      // Challenge C3: Update Information (Name & Photo) using Better Auth updateUser
      const res = await updateUser({
        name: name.trim(),
        image: image.trim() || undefined,
      });

      if (res?.error) {
        const errorText = res.error.message || "তথ্য আপডেট করতে ব্যর্থ হয়েছে।";
        setErrorMsg(errorText);
        toast.error(errorText);
        return;
      }

      toast.success("আপনার নাম ও প্রোফাইল ছবি সফলভাবে আপডেট হয়েছে!");
      router.push("/profile");
      router.refresh();
    } catch (err: unknown) {
      console.error("Update error:", err);
      const errorText = "তথ্য আপডেট করতে সমস্যা হয়েছে।";
      setErrorMsg(errorText);
      toast.error(errorText);
    } finally {
      setSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#07963d]" />
          <p className="text-sm font-medium">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const userInitial = name.trim() ? name.trim().charAt(0).toUpperCase() : "U";

  return (
    <div className="flex-1 py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg mx-auto space-y-6">
        
        {/* Navigation Breadcrumb */}
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 hover:text-[#07963d] font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>প্রোফাইলে ফিরে যান</span>
        </Link>

        {/* Update Form Card */}
        <div className="rounded-3xl bg-white border border-gray-200/90 p-6 sm:p-10 shadow-xs space-y-6">
          
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-[26px] font-bold text-[#111827]">
              প্রোফাইল ছবি ও তথ্য আপডেট
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-normal">
              আপনার ডিভাইসের ছবি আপলোড করুন অথবা নাম পরিবর্তন করুন
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm font-medium">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Profile Photo Live Preview & File Upload */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#f8faf8] border border-gray-200/80 space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#07963d]" />
                  <span>প্রোফাইল ছবি (Profile Photo)</span>
                </span>
                <span className="text-[11px] text-gray-400">লাইভ প্রিভিউ</span>
              </div>

              {/* Current Photo Preview and Actions */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#07963d] shrink-0 bg-white shadow-xs flex items-center justify-center">
                  {image ? (
                    <img
                      src={image}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-[#07963d]">{userInitial}</span>
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <p className="text-xs font-semibold text-gray-800">
                    {image ? "ছবি নির্বাচিত আছে" : "এখনও কোনো ছবি নেই"}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    নিচের বাটন চাপ দিয়ে কম্পিউটার বা মোবাইল থেকে আপনার আসল ছবি নির্বাচন করুন।
                  </p>
                </div>
              </div>

              {/* Direct File Upload Button */}
              <div className="space-y-1">
                <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-[#07963d]/40 bg-[#f0f8f2] hover:bg-[#e4f3e7] text-[#07963d] text-xs sm:text-sm font-semibold cursor-pointer transition-all shadow-2xs group">
                  <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  <span>ডিভাইস থেকে ছবি আপলোড করুন</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
                <p className="text-[11px] text-gray-400 text-center">
                  JPG, PNG বা WebP ফরম্যাট (সর্বোচ্চ 2MB)
                </p>
              </div>

              {/* Preset Avatars Option */}
              <div className="pt-2 border-t border-gray-200/70">
                <p className="text-xs text-gray-600 mb-2 font-medium">
                  অথবা পছন্দের বাজার অবতার বেছে নিন:
                </p>
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {AVATAR_PRESETS.map((avatar) => {
                    const isSelected = image === avatar.url;
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => setImage(avatar.url)}
                        className={`relative w-10 h-10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                          isSelected
                            ? "border-[#07963d] scale-105 shadow-xs"
                            : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                        }`}
                        title={avatar.name}
                      >
                        <img
                          src={avatar.url}
                          alt={avatar.name}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Name Input Field */}
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#07963d] focus:ring-2 focus:ring-[#07963d]/20 text-sm text-[#111827] outline-none transition-all"
                />
              </div>
            </div>

            {/* Read-only email notice */}
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-500 space-y-0.5">
              <p className="font-semibold text-gray-700">রেজিস্টার্ড ইমেইল এড্রেস:</p>
              <p className="font-mono text-gray-600 truncate">{session.user.email}</p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl bg-[#07963d] hover:bg-[#068034] active:bg-[#056d2c] disabled:opacity-70 text-white text-sm sm:text-base font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>আপডেট হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>পরিবর্তন সংরক্ষণ করুন</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
