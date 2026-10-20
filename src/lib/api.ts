import { Category, Product } from "@/types";

const PRIMARY_API = "https://openapi.programming-hero.com/api/bazardor";
const FALLBACK_API = "https://api.api-store.workers.dev/api/bazardor";

async function fetchWithFallback<T>(endpoint: string): Promise<T> {
  try {
    const res = await fetch(`${PRIMARY_API}${endpoint}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Primary API returned status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`Primary API failed for ${endpoint}, trying fallback...`, err);
    const resFallback = await fetch(`${FALLBACK_API}${endpoint}`, {
      next: { revalidate: 60 },
    });
    if (!resFallback.ok) {
      throw new Error(`Fallback API also failed with status: ${resFallback.status}`);
    }
    return await resFallback.json();
  }
}

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    return await fetchWithFallback<Category[]>("/categories");
  } catch (err) {
    console.error("Failed to fetch categories:", err);
    return [];
  }
}

/**
 * Fetch products (optionally filtered by category slug)
 */
export async function getProducts(categorySlug?: string): Promise<Product[]> {
  try {
    const endpoint = categorySlug ? `/products?category=${encodeURIComponent(categorySlug)}` : "/products";
    return await fetchWithFallback<Product[]>(endpoint);
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return [];
  }
}

/**
 * Fetch a single product by ID or slug
 */
export async function getProductById(idOrSlug: string | number): Promise<Product | null> {
  try {
    // If it's a numeric id, use /products/[id]
    const endpoint = `/products/${idOrSlug}`;
    return await fetchWithFallback<Product>(endpoint);
  } catch (err) {
    console.warn(`Failed direct fetch for product ${idOrSlug}, searching in full list...`, err);
    // If direct lookup fails, fetch all products and find matching id or slug
    const all = await getProducts();
    const found = all.find((p) => String(p.id) === String(idOrSlug) || p.slug === String(idOrSlug));
    return found || null;
  }
}
