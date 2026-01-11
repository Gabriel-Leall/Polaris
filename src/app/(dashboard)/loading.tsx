import { WidgetSkeleton } from "@/components/ui/Skeleton";
import { BentoGrid, GridColumn } from "@/components/layout";

export default function DashboardLoading() {
  return (
    <BentoGrid>
      <GridColumn span="left">
        <div className="flex flex-col gap-4 h-full">
          <WidgetSkeleton className="flex-1 bg-card/50 rounded-3xl border border-white/5" />
          <WidgetSkeleton className="h-[180px] bg-card/50 rounded-3xl border border-white/5" />
        </div>
      </GridColumn>
      <GridColumn span="center">
        <div className="flex flex-col gap-4 h-full">
          <WidgetSkeleton className="flex-1 bg-card/50 rounded-3xl border border-white/5" />
          <WidgetSkeleton className="h-[25%] min-h-[180px] bg-card/50 rounded-3xl border border-white/5" />
        </div>
      </GridColumn>
      <GridColumn span="right">
        <div className="flex flex-col gap-4 h-full">
          <WidgetSkeleton className="h-[30%] bg-card/50 rounded-3xl border border-white/5" />
          <WidgetSkeleton className="h-[30%] bg-card/50 rounded-3xl border border-white/5" />
          <WidgetSkeleton className="flex-1 bg-card/50 rounded-3xl border border-white/5" />
        </div>
      </GridColumn>
    </BentoGrid>
  );
}
