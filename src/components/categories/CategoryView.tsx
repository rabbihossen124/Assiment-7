"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Product, SortOption } from "@/types";
import { getProducts } from "@/lib/api";
import { getCategoryBySlug } from "@/lib/constants";
import { sortProducts, toBnDigits } from "@/lib/utils";
import ProductCard from "@/components/products/ProductCard";
import ProductCardSkeleton from "@/components/products/ProductCardSkeleton";

interface CategoryViewProps {
  slug: string;
}

export default function CategoryView({ slug }: CategoryViewProps) {
  const category = getCategoryBySlug(slug);
  const categoryName = category?.nameBn || slug;
  const categoryIcon = category?.icon || "🧺";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("default");

  useEffect(() => {
    let isMounted = true;

    async function loadCategoryData() {
      try {
        setLoading(true);
        setError(null);
        const data = await getProducts(slug);
        if (isMounted) {
          setProducts(data || []);
        }
      } catch (err) {
        console.error("Failed to load category products:", err);
        if (isMounted) {
          setError("ক্যাটাগরি ডেটা লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCategoryData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Challenge C1: Sort products based on selected sort option (handles numeric sorting)
  const displayedProducts = sortProducts(products, sortOption);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
      
      {/* Top Breadcrumb & Back Link */}
      <nav aria-label="ব্রেডক্রাম্ব" className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 hover:text-[#07963d] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>হোম</span>
        </Link>
        <span>/</span>
        <span className="text-gray-400">ক্যাটাগরি</span>
        <span>/</span>
        <span className="text-[#07963d] font-semibold">{categoryName}</span>
      </nav>

      {/* Category Header Row: Icon, Title & Sort Control */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-gray-200/80">
        
        {/* Left: Icon & Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white border border-gray-200/90 shadow-xs flex items-center justify-center text-3xl shrink-0">
            <span>{categoryIcon}</span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] leading-tight">
              {categoryName}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-normal mt-1">
              {loading
                ? "পণ্য লোড হচ্ছে..."
                : `মোট ${toBnDigits(displayedProducts.length)}টি পণ্য তালিকাভুক্ত আছে`}
            </p>
          </div>
        </div>

        {/* Right: Challenge C1 - Sort Control Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label htmlFor="sort-dropdown" className="text-xs sm:text-sm font-medium text-gray-600 flex items-center gap-1.5 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            <span>সাজান:</span>
          </label>
          <div className="relative">
            <select
              id="sort-dropdown"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="appearance-none bg-white border border-gray-300 hover:border-gray-400 focus:border-[#07963d] focus:ring-2 focus:ring-[#07963d]/20 rounded-xl px-3.5 py-2 pr-9 text-xs sm:text-sm font-semibold text-[#1f2937] shadow-xs cursor-pointer outline-none transition-all"
              aria-label="পণ্য সাজানোর অপশন"
            >
              <option value="default">ডিফল্ট</option>
              <option value="price-asc">দাম: কম থেকে বেশি</option>
              <option value="price-desc">দাম: বেশি থেকে কম</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-center text-sm font-medium">
          {error}
        </div>
      )}

      {/* Loading Skeleton State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={`cat-skeleton-${i}`} />
          ))}
        </div>
      ) : displayedProducts.length === 0 ? (
        /* Empty State (when category has no items or invalid slug) */
        <div className="rounded-3xl bg-white border border-gray-200/90 p-8 sm:p-14 text-center max-w-lg mx-auto shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#f4f7f4] border border-gray-100 flex items-center justify-center text-3xl mx-auto shadow-xs">
            <span>🧺</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
            কোনো পণ্য পাওয়া যায়নি
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed">
            দুঃখিত, এই ক্যাটাগরিতে এই মুহূর্তে কোনো পণ্য তালিকাভুক্ত নেই অথবা লিঙ্কটি সঠিক নয়।
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#07963d] hover:bg-[#068034] active:bg-[#056d2c] text-white text-sm sm:text-base font-semibold shadow-xs hover:shadow transition-all"
            >
              হোম পেজে ফিরে যান
            </Link>
          </div>
        </div>
      ) : (
        /* Product Cards Grid: 3 columns matching Figma */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={`cat-product-${product.id}`} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
