import {
  TasksWidget,
  ZenTimerWidget,
  BrainDumpWidget,
  CalendarWidget,
  HabitTrackerWidget,
  MediaPlayerWidget,
  QuickLinksWidget,
} from "@/components/widgets";
import { BentoGrid, GridColumn } from "@/components/layout";
import { WidgetCard } from "@/components/layout/WidgetCard";
import { ZenModeBlurWrapper } from "@/components/ui/ZenModeBlurWrapper";
import { Suspense } from "react";
import { WidgetSkeleton } from "@/components/ui/skeleton";
import { DashboardNotifications } from "@/components/dashboard/DashboardNotifications";

export default function Dashboard() {
  return (
    <>
      <Suspense fallback={null}>
        <DashboardNotifications />
      </Suspense>
      <BentoGrid>
        {/* Left Column - Tasks & Quick Links */}
        <GridColumn span="left">
          <div className="flex flex-col gap-[1px] bg-border h-full">
            <ZenModeBlurWrapper className="flex-1 min-h-0 bg-background">
              <WidgetCard scrollable={false} className="h-full">
                <Suspense fallback={<WidgetSkeleton />}>
                  <TasksWidget />
                </Suspense>
              </WidgetCard>
            </ZenModeBlurWrapper>

            <ZenModeBlurWrapper className="shrink-0 h-[220px] bg-background">
              <WidgetCard scrollable={false} className="h-full">
                <Suspense fallback={<WidgetSkeleton />}>
                  <QuickLinksWidget compact readOnly />
                </Suspense>
              </WidgetCard>
            </ZenModeBlurWrapper>
          </div>
        </GridColumn>

        {/* Center Column - Brain Dump & Timer */}
        <GridColumn span="center">
          <div className="flex flex-col gap-[1px] bg-border h-full">
            <ZenModeBlurWrapper
              excludeFromBlur
              className="flex-1 min-h-0 bg-background"
            >
              <WidgetCard scrollable={false} className="h-full">
                <Suspense fallback={<WidgetSkeleton />}>
                  <BrainDumpWidget />
                </Suspense>
              </WidgetCard>
            </ZenModeBlurWrapper>

            <ZenModeBlurWrapper
              excludeFromBlur
              className="shrink-0 h-[25%] min-h-[180px] bg-background"
            >
              <WidgetCard scrollable={false} className="h-full">
                <Suspense fallback={<WidgetSkeleton />}>
                  <ZenTimerWidget />
                </Suspense>
              </WidgetCard>
            </ZenModeBlurWrapper>
          </div>
        </GridColumn>

        {/* Right Column - Calendar, Habits & Media */}
        <GridColumn span="right">
          <div className="flex flex-col gap-[1px] bg-border h-full">
            <ZenModeBlurWrapper className="shrink-0 h-auto bg-background">
              <WidgetCard scrollable={false} className="h-full">
                <Suspense fallback={<WidgetSkeleton />}>
                  <CalendarWidget />
                </Suspense>
              </WidgetCard>
            </ZenModeBlurWrapper>

            <ZenModeBlurWrapper className="shrink-0 h-auto bg-background">
              <WidgetCard scrollable={false} className="h-full">
                <Suspense fallback={<WidgetSkeleton />}>
                  <HabitTrackerWidget />
                </Suspense>
              </WidgetCard>
            </ZenModeBlurWrapper>

            <ZenModeBlurWrapper
              excludeFromBlur
              className="flex-1 min-h-0 bg-background"
            >
              <WidgetCard scrollable={false} className="h-full">
                <Suspense fallback={<WidgetSkeleton />}>
                  <MediaPlayerWidget />
                </Suspense>
              </WidgetCard>
            </ZenModeBlurWrapper>
          </div>
        </GridColumn>
      </BentoGrid>
    </>
  );
}
