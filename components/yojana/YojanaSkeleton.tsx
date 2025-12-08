import { Skeleton } from "@/components/ui/skeleton";

export function YojanaSkeleton() {
  return (
    <div className="p-4 border rounded-xl shadow space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />

      <div className="flex gap-3 mt-3">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
      </div>

      <Skeleton className="h-4 w-1/3 mt-3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}
