"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  TrendingDown,
  TrendingUp,
  Minus,
  Store,
  MapPin,
  Share2,
  Check,
  Loader2,
  AlertCircle,
  Calendar,
  Scale,
  Tag,
  Info,
  Lock,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Product, MarketPrice } from "@/types";
import { getProductById } from "@/lib/api";
import { toBnDigits, formatUnitBn } from "@/lib/utils";

interface ProductDetailViewProps {
  idOrSlug: string;
}

export default function ProductDetailView({ idOrSlug }: ProductDetailViewProps) {
  const router = useRouter();
  const { data: session, isPending: isAuthPending } = useSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDivision, setSelectedDivision] = useState<string>("all");
  const [copied, setCopied] = useState<boolean>(false);

  // Protected Route Check: Must be logged in to view product details
  useEffect(() => {
    if (!isAuthPending && !session?.user) {
      toast.error("পণ্যের বিস্তারিত তথ্য দেখতে অনুগ্রহ করে প্রথমে লগইন করুন।", {
        id: "auth-guard-product",
      });
      router.replace(`/signin?redirect=/products/${encodeURIComponent(idOrSlug)}`);
    }
  }, [session, isAuthPending, router, idOrSlug]);

  // Load product data
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const data = await getProductById(idOrSlug);
        if (isMounted) {
          setProduct(data);
        }
      } catch (err) {
        console.error("Failed to load product details:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [idOrSlug]);

  // Handle Share link copy
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("লিংক কপি হয়েছে!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 1. Loading Auth State
  if (isAuthPending) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#07963d]/10 flex items-center justify-center text-[#07963d] animate-spin">
          <Loader2 className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-gray-500">অনুমতি যাচাই করা হচ্ছে...</p>
      </div>
    );
  }

  // 2. Unauthenticated State (prevent layout flashing while redirecting)
  if (!session?.user) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">লগইন প্রয়োজন</h2>
        <p className="text-sm text-gray-500">
          পণ্যের বিস্তারিত বাজারদর দেখতে অনুগ্রহ করে লগইন করুন।
        </p>
        <Link
          href={`/signin?redirect=/products/${encodeURIComponent(idOrSlug)}`}
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#07963d] text-white text-sm font-semibold hover:bg-[#068034] transition-colors shadow-xs"
        >
          লগইন করুন
        </Link>
      </div>
    );
  }

  // 3. Product Loading State
  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-48 bg-gray-200 rounded-md"></div>

        {/* Top Header Card Skeleton */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl shrink-0"></div>
          <div className="space-y-3 flex-1 w-full">
            <div className="h-7 bg-gray-200 rounded-md w-1/3"></div>
            <div className="h-4 bg-gray-100 rounded-md w-2/3"></div>
            <div className="flex gap-2 pt-1">
              <div className="h-6 w-20 bg-gray-100 rounded-full"></div>
              <div className="h-6 w-24 bg-gray-100 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-32 bg-gray-100 rounded-2xl"></div>
          <div className="h-32 bg-gray-100 rounded-2xl"></div>
          <div className="h-32 bg-gray-100 rounded-2xl"></div>
        </div>

        {/* Table Skeleton */}
        <div className="h-64 bg-gray-100 rounded-2xl"></div>
      </div>
    );
  }

  // 4. Product Not Found State
  if (!product) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-red-50 border border-red-200 flex items-center justify-center text-red-500">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">পণ্যটি পাওয়া যায়নি</h1>
          <p className="text-sm text-gray-500">
            আপনি যে পণ্যের তথ্য খুঁজছেন তা বর্তমানে তালিকায় অন্তর্ভুক্ত নেই অথবা লিংকটি পরিবর্তিত হয়েছে।
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#07963d] text-white text-sm font-semibold hover:bg-[#068034] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>হোম পেজে ফিরে যান</span>
          </Link>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            <span>সব ক্যাটাগরি দেখুন</span>
          </Link>
        </div>
      </div>
    );
  }

  // 5. Calculations for Summary Prices
  const markets = product.markets || [];
  const minPrices = markets.map((m) => m.min).filter((n) => typeof n === "number" && !isNaN(n));
  const maxPrices = markets.map((m) => m.max).filter((n) => typeof n === "number" && !isNaN(n));

  const minPrice = minPrices.length > 0 ? Math.min(...minPrices) : product.today;
  const maxPrice = maxPrices.length > 0 ? Math.max(...maxPrices) : product.today;

  // Average Price calculation
  const avgPrice =
    markets.length > 0
      ? Math.round(
          markets.reduce((acc, m) => acc + (m.min + m.max) / 2, 0) / markets.length
        )
      : product.today;

  // Find markets offering lowest and highest prices
  const lowestMarket = markets.find((m) => m.min === minPrice);
  const highestMarket = markets.find((m) => m.max === maxPrice);

  // Extract unique divisions for filter tabs
  const divisions = Array.from(new Set(markets.map((m) => m.division).filter(Boolean)));
  const filteredMarkets =
    selectedDivision === "all"
      ? markets
      : markets.filter((m) => m.division === selectedDivision);

  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";
  const pctFormatted = toBnDigits(Math.abs(product.change?.pct || 0));

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
      
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="ব্রেডক্রাম্ব"
        className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium overflow-x-auto pb-1"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 hover:text-[#07963d] transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>হোম</span>
        </Link>
        <span>/</span>
        <Link
          href={`/categories/${product.category}`}
          className="hover:text-[#07963d] transition-colors shrink-0 flex items-center gap-1"
        >
          <span>{product.categoryIcon}</span>
          <span>{product.categoryNameBn || product.category}</span>
        </Link>
        <span>/</span>
        <span className="text-[#07963d] font-semibold truncate shrink-0">
          {product.nameBn}
        </span>
      </nav>

      {/* 1. Top Summary Card */}
      <div className="rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          {/* Left: Emoji & Names */}
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#f8faf8] border border-gray-200/80 flex items-center justify-center text-4xl sm:text-5xl shrink-0 shadow-2xs">
              <span>{product.image}</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                  {product.nameBn}
                </h1>
                {/* Change Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    isUp
                      ? "bg-red-50 text-red-600 border border-red-200"
                      : isDown
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}
                >
                  {isUp && <TrendingUp className="w-3.5 h-3.5" />}
                  {isDown && <TrendingDown className="w-3.5 h-3.5" />}
                  {!isUp && !isDown && <Minus className="w-3.5 h-3.5" />}
                  <span>{pctFormatted}%</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-gray-500 font-normal">
                {product.nameBn} এর আজকের বাজারদর ও প্রধান প্রধান পাইকারি ও খুচরা বাজারের মূল্যের সঠিক হিসাব।
              </p>

              {/* Tags / Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Link
                  href={`/categories/${product.category}`}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 hover:bg-[#eef6f0] hover:text-[#07963d] text-xs font-medium text-gray-600 transition-colors"
                >
                  <Tag className="w-3 h-3" />
                  <span>{product.categoryIcon} {product.categoryNameBn}</span>
                </Link>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 text-xs font-medium text-gray-600">
                  <Scale className="w-3 h-3" />
                  <span>{formatUnitBn(product.unit)}</span>
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                  <Store className="w-3 h-3" />
                  <span>{toBnDigits(markets.length)}টি বাজার অন্তর্ভুক্ত</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Today's Main Price & Share */}
          <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100 gap-3">
            <div className="text-left sm:text-right">
              <span className="text-xs text-gray-400 font-medium block">
                আজকের রেফারেন্স মূল্য
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#07963d]">
                {toBnDigits(product.today)}{" "}
                <span className="text-sm font-normal text-gray-500">টাকা</span>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer"
              title="লিংক কপি করুন"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#07963d]" />
                  <span className="text-[#07963d] font-semibold">কপি হয়েছে</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>শেয়ার করুন</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Price - Summary (Requirement: Minimum, Maximum, Average) */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
          <span>মূল্য বিশ্লেষণ ও পরিসংখ্যান</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Card 1: Minimum Price */}
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 to-white p-5 sm:p-6 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-emerald-800">
                সর্বনিম্ন দাম
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700">
              {toBnDigits(minPrice)}{" "}
              <span className="text-sm font-normal text-gray-600">টাকা</span>
            </div>
            {lowestMarket && (
              <p className="text-xs text-gray-500 truncate pt-1">
                📍 {lowestMarket.market} ({lowestMarket.division})
              </p>
            )}
          </div>

          {/* Card 2: Average Price */}
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/60 to-white p-5 sm:p-6 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-blue-800">
                গড় দাম
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-700">
              {toBnDigits(avgPrice)}{" "}
              <span className="text-sm font-normal text-gray-600">টাকা</span>
            </div>
            <p className="text-xs text-gray-500 pt-1">
              মোট {toBnDigits(markets.length)}টি প্রধান বাজারের গড় হিসাব
            </p>
          </div>

          {/* Card 3: Maximum Price */}
          <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/60 to-white p-5 sm:p-6 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-rose-800">
                সর্বোচ্চ দাম
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-700">
              {toBnDigits(maxPrice)}{" "}
              <span className="text-sm font-normal text-gray-600">টাকা</span>
            </div>
            {highestMarket && (
              <p className="text-xs text-gray-500 truncate pt-1">
                📍 {highestMarket.market} ({highestMarket.division})
              </p>
            )}
          </div>

        </div>
      </div>

      {/* 3. Historical Price Comparison Bar */}
      <div className="rounded-2xl border border-gray-200/90 bg-white p-5 sm:p-6 shadow-2xs">
        <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>আগের দিনগুলোর তুলনায় দামের ট্রেন্ড</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-xs text-gray-400 block mb-1">আজকের দাম</span>
            <span className="text-base sm:text-lg font-bold text-[#07963d]">
              {toBnDigits(product.today)} টাকা
            </span>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-xs text-gray-400 block mb-1">গতকাল</span>
            <span className="text-base sm:text-lg font-bold text-gray-700">
              {toBnDigits(product.yesterday || product.today)} টাকা
            </span>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-xs text-gray-400 block mb-1">গত সপ্তাহে</span>
            <span className="text-base sm:text-lg font-bold text-gray-700">
              {toBnDigits(product.lastWeek || product.today)} টাকা
            </span>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-xs text-gray-400 block mb-1">গত মাসে</span>
            <span className="text-base sm:text-lg font-bold text-gray-700">
              {toBnDigits(product.lastMonth || product.today)} টাকা
            </span>
          </div>
        </div>
      </div>

      {/* 4. বাজারভিত্তিক আজকের দাম (Requirement: Show all data based on different Bazar) */}
      <div className="rounded-3xl border border-gray-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Header & Division Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-[#111827] flex items-center gap-2">
              <Store className="w-5 h-5 text-[#07963d]" />
              <span>বাজারভিত্তিক আজকের দাম</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5">
              বিভিন্ন বাজার অনুযায়ী বর্তমান সর্বনিম্ন ও সর্বোচ্চ খুচরা মূল্যের তালিকা
            </p>
          </div>

          {/* Division Filter Pills */}
          {divisions.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setSelectedDivision("all")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedDivision === "all"
                    ? "bg-[#07963d] text-white shadow-2xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                সকল ({toBnDigits(markets.length)})
              </button>
              {divisions.map((div) => {
                const count = markets.filter((m) => m.division === div).length;
                return (
                  <button
                    key={div}
                    type="button"
                    onClick={() => setSelectedDivision(div)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      selectedDivision === div
                        ? "bg-[#07963d] text-white shadow-2xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {div} ({toBnDigits(count)})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Markets Table for Desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
                <th className="pb-3 pr-4">বাজারের নাম</th>
                <th className="pb-3 px-4">বিভাগ</th>
                <th className="pb-3 px-4 text-right">সর্বনিম্ন দাম</th>
                <th className="pb-3 px-4 text-right">সর্বোচ্চ দাম</th>
                <th className="pb-3 px-4 text-right">গড় দাম</th>
                <th className="pb-3 pl-4 text-right">দামের ব্যবধান</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMarkets.map((m, index) => {
                const avg = Math.round((m.min + m.max) / 2);
                const diff = m.max - m.min;

                return (
                  <tr
                    key={index}
                    className="hover:bg-[#f8faf8] transition-colors group"
                  >
                    {/* Market Name */}
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0 group-hover:bg-[#eef6f0] group-hover:text-[#07963d] transition-colors">
                          <Store className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-gray-900">
                          {m.market}
                        </span>
                      </div>
                    </td>

                    {/* Division */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{m.division}</span>
                      </span>
                    </td>

                    {/* Min Price */}
                    <td className="py-4 px-4 text-right font-medium text-emerald-700">
                      {toBnDigits(m.min)} টাকা
                    </td>

                    {/* Max Price */}
                    <td className="py-4 px-4 text-right font-medium text-rose-700">
                      {toBnDigits(m.max)} টাকা
                    </td>

                    {/* Avg Price */}
                    <td className="py-4 px-4 text-right font-bold text-gray-800">
                      {toBnDigits(avg)} টাকা
                    </td>

                    {/* Spread */}
                    <td className="py-4 pl-4 text-right text-xs text-gray-500">
                      ± {toBnDigits(diff)} টাকা
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Market Cards */}
        <div className="sm:hidden space-y-3">
          {filteredMarkets.map((m, index) => {
            const avg = Math.round((m.min + m.max) / 2);

            return (
              <div
                key={index}
                className="rounded-2xl border border-gray-100 bg-[#fbfdfb] p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#07963d]" />
                    <span className="font-bold text-gray-900 text-sm">
                      {m.market}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                    {m.division}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="bg-white p-2 rounded-xl border border-gray-100">
                    <span className="text-[11px] text-gray-400 block mb-0.5">
                      সর্বনিম্ন
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      {toBnDigits(m.min)} ৳
                    </span>
                  </div>

                  <div className="bg-white p-2 rounded-xl border border-gray-100">
                    <span className="text-[11px] text-gray-400 block mb-0.5">
                      গড়
                    </span>
                    <span className="text-xs font-bold text-gray-800">
                      {toBnDigits(avg)} ৳
                    </span>
                  </div>

                  <div className="bg-white p-2 rounded-xl border border-gray-100">
                    <span className="text-[11px] text-gray-400 block mb-0.5">
                      সর্বোচ্চ
                    </span>
                    <span className="text-xs font-bold text-rose-600">
                      {toBnDigits(m.max)} ৳
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer Note */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-800 flex items-start gap-2.5">
          <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <p className="leading-relaxed">
            * বিভিন্ন বাজারের দর স্থানীয় সরবরাহ, পরিবহন খরচ এবং মানের তারতম্যের কারণে সামান্য ওঠানামা করতে পারে। এই তথ্য ক্রেতাদের যাচাই করার সুবিধার্থে প্রকাশিত।
          </p>
        </div>

      </div>

      {/* 5. Bottom Navigation Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200/80">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-600 hover:text-[#07963d] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>সকল পণ্যের তালিকায় ফিরে যান</span>
        </Link>

        <Link
          href={`/categories/${product.category}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#eef6f0] text-[#07963d] text-xs sm:text-sm font-semibold hover:bg-[#d8eedd] transition-colors"
        >
          <span>{product.categoryNameBn || product.category}-এর অন্যান্য পণ্য দেখুন</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
