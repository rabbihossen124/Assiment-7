import { Product, SortOption } from "@/types";

const bnDigits: { [key: string]: string } = {
  "0": "০",
  "1": "১",
  "2": "২",
  "3": "৩",
  "4": "৪",
  "5": "৫",
  "6": "৬",
  "7": "৭",
  "8": "৮",
  "9": "৯",
};

/**
 * Converts English numbers or strings to Bengali digits.
 * E.g., 1850 -> ১,৮৫০, 2.9 -> ২.৯
 */
export function toBnDigits(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "";
  
  let str: string;
  if (typeof value === "number") {
    // Format with commas if integer or standard format
    str = value.toLocaleString("en-US");
  } else {
    str = String(value);
  }

  return str.replace(/[0-9]/g, (digit) => bnDigits[digit] || digit);
}

/**
 * Formats price in Taka with Bengali numerals.
 * E.g. 148 -> "১৪৮ টাকা"
 */
export function formatPriceBn(price: number): string {
  return `${toBnDigits(price)} টাকা`;
}

/**
 * Maps unit identifiers to Bengali text.
 * E.g. 'kg' -> 'প্রতি কেজি', 'litre' -> 'প্রতি লিটার'
 */
export function formatUnitBn(unit: string): string {
  switch (unit?.toLowerCase()) {
    case "kg":
      return "প্রতি কেজি";
    case "litre":
    case "liter":
      return "প্রতি লিটার";
    case "dozen":
      return "প্রতি ডজন";
    case "piece":
    case "hali":
      return "প্রতি পিস";
    default:
      return unit ? `প্রতি ${unit}` : "";
  }
}

/**
 * Formats current date in Bangla format: e.g. "২০ অক্টোবর ২০২৬"
 */
export function getTodayBnDate(): string {
  const monthsBn = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];
  const daysBn = [
    "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"
  ];

  const now = new Date();
  const dayName = daysBn[now.getDay()];
  const dateBn = toBnDigits(now.getDate());
  const monthBn = monthsBn[now.getMonth()];
  const yearBn = toBnDigits(now.getFullYear());

  return `${dayName}, ${dateBn} ${monthBn} ${yearBn}`;
}

/**
 * Challenge C1: Numeric sorting for products.
 * Handles sort by default, price ascending, or price descending.
 */
export function sortProducts(products: Product[], sortOption: SortOption): Product[] {
  const cloned = [...products];
  if (sortOption === "price-asc") {
    return cloned.sort((a, b) => a.today - b.today);
  }
  if (sortOption === "price-desc") {
    return cloned.sort((a, b) => b.today - a.today);
  }
  return cloned;
}
