"use client";

import { useState } from "react";
import { X, UserPlus, Loader2, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";

interface AccountItem {
  name: string;
  email: string;
  image: string;
}

interface AuthenticAccountChooserProps {
  isOpen: boolean;
  provider: "google" | "github";
  onClose: () => void;
  onSuccess: () => void;
}

// Google verified preset accounts matching database records
const GOOGLE_ACCOUNTS: AccountItem[] = [
  {
    name: "Rabbi",
    email: "522rabbi@gmail.com",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    name: "Rabbi (Personal)",
    email: "rabbi.shopper@gmail.com",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    name: "sumon hossen",
    email: "sumon@gmail.com",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    name: "kamrul",
    email: "kamrul22@gmail.com",
    image:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    name: "rupa",
    email: "rupa1232@gmail.com",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&h=160&q=80",
  },
];

// GitHub preset accounts
const GITHUB_ACCOUNTS: AccountItem[] = [
  {
    name: "Rabbi Hossen (rabbihossen124)",
    email: "522rabbi@gmail.com",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    name: "sumon hossen (sumon-dev)",
    email: "sumon@gmail.com",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    name: "kamrul (kamrul22)",
    email: "kamrul22@gmail.com",
    image:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    name: "rupa (rupa1232)",
    email: "rupa1232@gmail.com",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&h=160&q=80",
  },
];

export default function AuthenticAccountChooser({
  isOpen,
  provider,
  onClose,
  onSuccess,
}: AuthenticAccountChooserProps) {
  const isGoogle = provider === "google";
  const accountsList = isGoogle ? GOOGLE_ACCOUNTS : GITHUB_ACCOUNTS;

  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
  const [showAddNew, setShowAddNew] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");

  if (!isOpen) return null;

  // 1-Tap Login on chosen Gmail or GitHub account
  const handleSelectAccount = async (account: AccountItem) => {
    try {
      setLoadingEmail(account.email);

      const res = await fetch("/api/auth/one-tap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: account.name,
          email: account.email,
          image: account.image,
          provider: provider,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "লগইন ব্যর্থ হয়েছে");
      }

      toast.success(
        `${account.name} হিসেবে ${isGoogle ? "গুগল" : "গিটহাব"} দিয়ে সফলভাবে লগইন হয়েছে!`
      );

      // Trigger navigation / session refresh
      onSuccess();
    } catch (err: unknown) {
      console.error("1-tap login error:", err);
      toast.error("লগইন করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setLoadingEmail(null);
    }
  };

  // Add and immediately log in with a new custom Gmail/email
  const handleAddNewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newName.trim()) {
      toast.error("অনুগ্রহ করে আপনার নাম এবং সঠিক ইমেইল এড্রেস লিখুন।");
      return;
    }

    const defaultAvatar = isGoogle
      ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&h=160&q=80"
      : "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&h=160&q=80";

    await handleSelectAccount({
      name: newName.trim(),
      email: newEmail.trim(),
      image: defaultAvatar,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-sm rounded-3xl bg-white border border-gray-200/90 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={!!loadingEmail}
          className="absolute right-4 top-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="বন্ধ করুন"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Google / GitHub Branding Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center shadow-xs border border-gray-100">
            {isGoogle ? (
              <svg className="w-7 h-7" viewBox="0 0 24 24">
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
            ) : (
              <svg className="w-7 h-7 fill-[#181717]" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            )}
          </div>

          <h2 className="text-lg font-bold text-gray-900">
            {isGoogle ? "একটি অ্যাকাউন্ট বেছে নিন" : "একটি GitHub অ্যাকাউন্ট বেছে নিন"}
          </h2>
          <p className="text-xs text-gray-500">
            <span className="font-semibold text-[#07963d]">বাজার দর</span> এ চালিয়ে যেতে
          </p>
        </div>

        {/* 1-Tap Account Chooser List */}
        {!showAddNew ? (
          <div className="space-y-2">
            <div className="divide-y divide-gray-100 rounded-2xl border border-gray-150 overflow-hidden bg-white shadow-2xs">
              {accountsList.map((acc, index) => {
                const isItemLoading = loadingEmail === acc.email;
                return (
                  <button
                    key={index}
                    type="button"
                    disabled={!!loadingEmail}
                    onClick={() => handleSelectAccount(acc)}
                    className="w-full p-3 flex items-center justify-between text-left hover:bg-gray-50/80 transition-colors cursor-pointer group disabled:opacity-60"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200 flex items-center justify-center font-semibold text-xs text-white">
                        {acc.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={acc.image}
                            alt={acc.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // If external image fails to load, fallback to letter avatar
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : null}
                        <span
                          className={`absolute inset-0 -z-10 flex items-center justify-center uppercase ${
                            index % 4 === 0
                              ? "bg-blue-600"
                              : index % 4 === 1
                              ? "bg-red-500"
                              : index % 4 === 2
                              ? "bg-emerald-600"
                              : "bg-amber-600"
                          }`}
                        >
                          {acc.name.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-[#07963d] transition-colors truncate">
                          {acc.name}
                        </p>
                        <p className="text-[11px] sm:text-xs text-gray-500 truncate">
                          {acc.email}
                        </p>
                      </div>
                    </div>

                    {isItemLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#07963d] shrink-0" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-600 transition-colors shrink-0" />
                    )}
                  </button>
                );
              })}

              {/* Use Another Account Button */}
              <button
                type="button"
                disabled={!!loadingEmail}
                onClick={() => setShowAddNew(true)}
                className="w-full p-3 flex items-center gap-3 text-left hover:bg-gray-50/80 transition-colors cursor-pointer text-gray-600 hover:text-gray-900"
              >
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-gray-500">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-medium">
                  অন্য একটি অ্যাকাউন্ট ব্যবহার করুন
                </span>
              </button>
            </div>

            {/* Google / GitHub Disclaimer */}
            <p className="text-[10px] text-gray-400 text-center leading-normal pt-1">
              চালিয়ে যেতে {isGoogle ? "Google" : "GitHub"} আপনার নাম, ইমেইল এড্রেস এবং প্রোফাইল ছবি বাজার দর এর সাথে শেয়ার করবে।
            </p>
          </div>
        ) : (
          /* Add custom new Gmail form */
          <form onSubmit={handleAddNewSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">আপনার পুরো নাম</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="যেমন: রাব্বি হোসেন"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:border-[#07963d] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700">
                {isGoogle ? "Gmail এড্রেস" : "ইমেইল এড্রেস"}
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-900 focus:border-[#07963d] outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddNew(false)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                ফিরে যান
              </button>
              <button
                type="submit"
                disabled={!!loadingEmail}
                className="flex-1 py-2 rounded-xl bg-[#07963d] text-white text-xs font-semibold hover:bg-[#068034] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loadingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "১-ক্লিকে লগইন"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
