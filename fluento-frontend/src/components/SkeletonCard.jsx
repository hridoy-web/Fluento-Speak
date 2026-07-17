export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-border animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-48 bg-slate-200" />
      <div className="p-6 space-y-4">
        {/* Badges row */}
        <div className="flex justify-between items-center">
          <div className="h-5 w-20 bg-slate-200 rounded-full" />
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
          </div>
        </div>
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-5/6" />
          <div className="h-4 bg-slate-200 rounded w-3/4" />
        </div>
        {/* Description */}
        <div className="space-y-2 pt-1">
          <div className="h-3 bg-slate-200 rounded w-full" />
          <div className="h-3 bg-slate-200 rounded w-full" />
          <div className="h-3 bg-slate-200 rounded w-2/3" />
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-200" />
            <div className="space-y-1.5">
              <div className="h-2.5 w-20 bg-slate-200 rounded" />
              <div className="h-2 w-14 bg-slate-200 rounded" />
            </div>
          </div>
          <div className="h-3 w-12 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
}
