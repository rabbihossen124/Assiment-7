import { Metadata } from "next";
import { CATEGORIES, getCategoryBySlug } from "@/lib/constants";
import CategoryView from "@/components/categories/CategoryView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  const title = category ? `${category.nameBn} — বাজার দর` : `${slug} — বাজার দর`;

  return {
    title,
    description: `আজকের ${category?.nameBn || slug}-এর তাজা বাজারদর। গড় ও বাজারভিত্তিক সর্বনিম্ন-সর্বোচ্চ মূল্যের সঠিক তালিকা।`,
  };
}

export async function generateStaticParams() {
  return CATEGORIES.filter((c) => c.slug).map((c) => ({
    slug: c.slug,
  }));
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  return <CategoryView slug={slug} />;
}
