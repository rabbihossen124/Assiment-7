import Link from "next/link";
import { Product } from "@/types";
import { toBnDigits, formatUnitBn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";
  const isFlat = !isUp && !isDown;

  const pctFormatted = toBnDigits(Math.abs(product.change?.pct || 0));

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block rounded-2xl border border-gray-200/90 bg-white p-5 sm:p-6 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all duration-200"
      aria-label={`${product.nameBn} এর বিস্তারিত দেখুন`}
    >
      <div className="flex flex-col justify-between h-full">
        {/* Top: Emoji + Name & Unit */}
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#f8faf8] border border-gray-100 flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform duration-200">
            <span>{product.image}</span>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold text-[#1f2937] group-hover:text-[#07963d] transition-colors truncate leading-snug">
              {product.nameBn}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5">
              {formatUnitBn(product.unit)}
            </p>
          </div>
        </div>

        {/* Bottom: Price row & Change badge without divider line */}
        <div className="mt-5 sm:mt-6 flex items-end justify-between gap-2">
          {/* Price Label & Value */}
          <div>
            <p className="text-xs text-gray-400 font-normal leading-none mb-1.5">
              আজকের দাম
            </p>
            <p className="text-xl sm:text-2xl font-bold text-[#1f2937] leading-none">
              {toBnDigits(product.today)}{" "}
              <span className="text-sm text-gray-600 font-normal">
                টাকা
              </span>
            </p>
          </div>

          {/* Change Badge (red up, green down, gray flat matching Figma) */}
          <div className="shrink-0">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                isUp
                  ? "bg-[#fef2f2] text-red-500 border border-red-100"
                  : isDown
                  ? "bg-[#ecfdf5] text-emerald-600 border border-emerald-100"
                  : "bg-gray-50 text-gray-500 border border-gray-100"
              }`}
            >
              <span>{isUp ? "▲" : isDown ? "▼" : "—"}</span>
              <span>{isFlat ? "০.০%" : `${pctFormatted}%`}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
