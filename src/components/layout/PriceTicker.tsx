"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { getProducts } from "@/lib/api";
import { toBnDigits, formatShortUnitBn } from "@/lib/utils";

// Initial fallback items to avoid flash of empty content
const INITIAL_TICKER_ITEMS: Partial<Product>[] = [
  { id: 1, nameBn: "মিনিকেট চাল", unit: "kg", image: "🍚", today: 72, change: { dir: "up", pct: 2.9 } },
  { id: 2, nameBn: "নাজিরশাইল চাল", unit: "kg", image: "🍚", today: 82, change: { dir: "down", pct: 1.2 } },
  { id: 4, nameBn: "মসুর ডাল", unit: "kg", image: "🫘", today: 135, change: { dir: "up", pct: 3.8 } },
  { id: 7, nameBn: "সয়াবিন তেল", unit: "litre", image: "🛢️", today: 168, change: { dir: "up", pct: 1.8 } },
  { id: 10, nameBn: "দেশি পেঁয়াজ", unit: "kg", image: "🧅", today: 110, change: { dir: "up", pct: 4.8 } },
  { id: 11, nameBn: "গোল আলু", unit: "kg", image: "🥔", today: 55, change: { dir: "down", pct: 3.5 } },
  { id: 16, nameBn: "রুই মাছ", unit: "kg", image: "🐟", today: 380, change: { dir: "down", pct: 2.6 } },
  { id: 20, nameBn: "ব্রয়লার মুরগি", unit: "kg", image: "🍗", today: 185, change: { dir: "up", pct: 2.8 } },
  { id: 23, nameBn: "ফার্মের ডিম", unit: "dozen", image: "🥚", today: 150, change: { dir: "down", pct: 3.2 } },
  { id: 28, nameBn: "রসুন", unit: "kg", image: "🧄", today: 220, change: { dir: "up", pct: 2.3 } },
];

export default function PriceTicker() {
  const [products, setProducts] = useState<Partial<Product>[]>(INITIAL_TICKER_ITEMS);

  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        const data = await getProducts();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Ticker fetch error, using fallback ticker items:", err);
      }
    }
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Duplicate items for continuous infinite scroll
  const displayItems = [...products, ...products];

  return (
    <div
      aria-label="লাইভ বাজারদর স্ক্রোলিং স্ট্রিপ"
      className="relative w-full bg-[#ebf5ed] text-[#1b2b1e] border-b border-[#dce8dd] overflow-hidden text-xs sm:text-sm py-2"
    >
      <div className="flex items-center">
        {/* Left Sticky Live Badge */}
        <div className="z-10 flex items-center gap-1.5 px-3 sm:px-4 py-1 bg-[#07963d] text-white font-semibold rounded-r-full shadow-sm shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="tracking-wide whitespace-nowrap text-xs font-bold">লাইভ বাজারদর:</span>
        </div>

        {/* Marquee Track */}
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee hover:[animation-play-state:paused] flex items-center whitespace-nowrap">
            {displayItems.map((item, idx) => {
              const isUp = item.change?.dir === "up";
              const isDown = item.change?.dir === "down";
              const priceText = `${toBnDigits(item.today)} টাকা/${formatShortUnitBn(item.unit || "")}`;
              const pctText = `${toBnDigits(Math.abs(item.change?.pct || 0))}%`;

              return (
                <Link
                  key={`${item.id}-${idx}`}
                  href={`/products/${item.id}`}
                  className="inline-flex items-center gap-2 mx-4 sm:mx-6 py-0.5 hover:text-[#07963d] transition-colors group cursor-pointer"
                  title={`${item.nameBn} এর বিস্তারিত দেখুন`}
                >
                  <span className="text-base sm:text-lg leading-none">{item.image}</span>
                  <span className="font-semibold text-[#1b2b1e] group-hover:text-[#07963d] group-hover:underline underline-offset-4">
                    {item.nameBn}
                  </span>
                  <span className="text-[#07963d] font-bold">
                    {priceText}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      isUp
                        ? "bg-[#fee2e2] text-[#dc2626] border border-[#fecaca]"
                        : isDown
                        ? "bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {isUp ? "▲" : isDown ? "▼" : "—"} {pctText}
                  </span>
                  <span className="text-[#b9d2be] ml-2 select-none">•</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
