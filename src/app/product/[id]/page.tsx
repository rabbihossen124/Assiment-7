import { Metadata } from "next";
import { Suspense } from "react";
import ProductDetailView from "@/components/products/ProductDetailView";

export const instant = false;

export const metadata: Metadata = {
  title: "পণ্যের বিস্তারিত — বাজার দর",
  description: "আজকের বাজারদর, গড় মূল্য এবং বিভিন্ন বাজারের দামের তুলনামূলক তালিকা।",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

async function ProductPageContent({ params }: PageProps) {
  const { id } = await params;
  return <ProductDetailView idOrSlug={id} />;
}

export default function ProductDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={null}>
      <ProductPageContent params={params} />
    </Suspense>
  );
}
