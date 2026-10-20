import HeroSection from "@/components/home/HeroSection";
import HomeProductSections from "@/components/home/HomeProductSections";

export default function Home() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10 sm:space-y-12">
      {/* 1. Hero Banner Section */}
      <HeroSection />

      {/* 2. Main Product Sections: A (দাম বেড়েছে), B (দাম কমেছে), C (সব পণ্য) */}
      <HomeProductSections />
    </div>
  );
}
