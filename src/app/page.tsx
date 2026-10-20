import HeroSection from "@/components/home/HeroSection";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 pb-16">
      {/* Hero Banner Section (Requirement 2) */}
      <HeroSection />

      {/* Target Anchor Section for Hero CTA (#সব-পণ্য) */}
      <div id="সব-পণ্য" className="scroll-mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Product sections will be rendered here in Part 4 */}
      </div>
    </div>
  );
}
