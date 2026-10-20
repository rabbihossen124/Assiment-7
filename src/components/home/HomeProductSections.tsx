"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { getProducts } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";
import ProductCardSkeleton from "@/components/products/ProductCardSkeleton";
import { toBnDigits } from "@/lib/utils";

export default function HomeProductSections() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const data = await getProducts();
        if (isMounted) {
          setProducts(data || []);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to load home products:", err);
        if (isMounted) {
          setError("পণ্য লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
        }
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
  }, []);

  // Top 6 Risers (দাম বেড়েছে)
  const topRisers = products
    .filter((p) => p.change?.dir === "up" || p.change?.pct > 0)
    .sort((a, b) => (b.change?.pct || 0) - (a.change?.pct || 0))
    .slice(0, 6);

  // Top 6 Fallers (দাম কমেছে)
  const topFallers = products
    .filter((p) => p.change?.dir === "down" || p.change?.pct < 0)
    .sort((a, b) => (a.change?.pct || 0) - (b.change?.pct || 0))
    .slice(0, 6);

  return (
    <div className="w-full space-y-10 sm:space-y-12">
      
      {/* Error State */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-center text-sm font-medium">
          {error}
        </div>
      )}

      {/* ======================================================== */}
      {/* Section A: ▲ আজ দাম বেড়েছে                                */}
      {/* ======================================================== */}
      <section aria-label="আজ দাম বেড়েছে" className="w-full space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1f2937] flex items-center gap-2">
          <span className="text-red-500 text-sm sm:text-base">▲</span>
          <span>আজ দাম বেড়েছে</span>
        </h2>

        {/* 3 Columns Grid matching Hero card width */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={`riser-skeleton-${i}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {topRisers.map((product) => (
              <ProductCard key={`riser-${product.id}`} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* Section B: ▼ আজ দাম কমেছে                                */}
      {/* ======================================================== */}
      <section aria-label="আজ দাম কমেছে" className="w-full space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1f2937] flex items-center gap-2">
          <span className="text-emerald-600 text-sm sm:text-base">▼</span>
          <span>আজ দাম কমেছে</span>
        </h2>

        {/* 3 Columns Grid matching Hero card width */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={`faller-skeleton-${i}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {topFallers.map((product) => (
              <ProductCard key={`faller-${product.id}`} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* Section C: সব পণ্য                                      */}
      {/* ======================================================== */}
      <section id="সব-পণ্য" className="w-full space-y-4 scroll-mt-28">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1f2937]">
            সব পণ্য
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-normal mt-1">
            মোট {toBnDigits(products.length || 33)}টি পণ্য দেখানো হচ্ছে
          </p>
        </div>

        {/* 3 Columns Grid matching Hero card width */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={`all-skeleton-${i}`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={`product-${product.id}`} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
