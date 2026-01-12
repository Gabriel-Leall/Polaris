import { Skeleton } from "@/components/ui/skeleton";

export default function TasksLoading() {
  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          {/* Page Heading Skeleton */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-6 w-64" />
            </div>
            <Skeleton className="h-6 w-32" />
          </div>

          {/* Input Area Skeleton */}
          <div className="flex flex-col gap-4 bg-card/50 border border-white/5 backdrop-blur-xl p-4 rounded-3xl">
            <div className="flex flex-col md:flex-row gap-3">
              <Skeleton className="h-14 flex-1 rounded-2xl" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-14 w-40 rounded-2xl" />
                <Skeleton className="h-14 w-32 rounded-2xl" />
                <Skeleton className="h-14 w-32 rounded-2xl" />
              </div>
            </div>
            <div className="flex gap-2 pt-2 border-t border-white/5">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>

          {/* Filters Skeleton */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>

          {/* Task List Skeleton */}
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center gap-4 bg-card/40 border border-white/5 p-4 rounded-3xl"
              >
                <div className="flex items-start gap-4 flex-1">
                  <Skeleton className="w-6 h-6 rounded-lg shrink-0" />
                  <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
