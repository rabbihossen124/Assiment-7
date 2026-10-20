export default function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200/90 bg-white p-5 sm:p-6 shadow-xs animate-pulse flex flex-col justify-between h-[170px]">
      {/* Top row: Emoji box + Name & Unit skeleton */}
      <div className="flex items-center gap-3.5">
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gray-100 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded-md w-3/4" />
          <div className="h-3 bg-gray-100 rounded-md w-1/2" />
        </div>
      </div>

      {/* Bottom row: Price + Badge skeleton without divider */}
      <div className="mt-5 sm:mt-6 flex items-end justify-between">
        <div className="space-y-1.5">
          <div className="h-2.5 bg-gray-100 rounded w-14" />
          <div className="h-6 bg-gray-200 rounded-md w-24" />
        </div>
        <div className="h-7 w-20 bg-gray-100 rounded-full" />
      </div>
    </div>
  );
}
