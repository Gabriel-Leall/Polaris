import {
  TasksWidget,
  ZenTimerWidget,
  BrainDumpWidget,
  CalendarWidget,
  HabitTrackerWidget,
  MediaPlayerWidget,
  QuickLinksWidget,
} from "@/components/widgets";
import {
  DashboardLayout,
  Sidebar,
  SidebarNav,
  BentoGrid,
  GridColumn,
} from "@/components/layout";
import { WidgetCard } from "@/components/layout/WidgetCard";
import { ZenModeBlurWrapper } from "@/components/ui/ZenModeBlurWrapper";

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* Sidebar */}
      <Sidebar>
        <SidebarNav activeItem="dashboard" />
      </Sidebar>

      {/* Main Content Grid - Tetris Layout */}
      <BentoGrid>
        {/* Left Column - Tasks & Quick Links */}
        <GridColumn span="left">
          <div className="flex flex-col gap-4 h-full">
            <ZenModeBlurWrapper className="flex-1 min-h-0">
              <WidgetCard scrollable={false} className="h-full">
                <TasksWidget />
              </WidgetCard>
            </ZenModeBlurWrapper>

            <ZenModeBlurWrapper className="shrink-0 h-[180px]">
              <WidgetCard scrollable={false} className="h-full">
                <QuickLinksWidget compact readOnly />
              </WidgetCard>
            </ZenModeBlurWrapper>
          </div>
        </GridColumn>

        {/* Center Column - Brain Dump & Timer */}
        <GridColumn span="center">
          <div className="flex flex-col gap-4 h-full">
            <ZenModeBlurWrapper excludeFromBlur className="flex-1 min-h-0">
              <WidgetCard scrollable={false} className="h-full">
                <BrainDumpWidget />
              </WidgetCard>
            </ZenModeBlurWrapper>

            <ZenModeBlurWrapper
              excludeFromBlur
              className="shrink-0 h-[25%] min-h-[180px]"
            >
              <WidgetCard scrollable={false} className="h-full">
                <ZenTimerWidget />
              </WidgetCard>
            </ZenModeBlurWrapper>
          </div>
        </GridColumn>

        {/* Right Column - Calendar, Habits & Media */}
        <GridColumn span="right">
          <div className="flex flex-col gap-4 h-full">
            <ZenModeBlurWrapper className="shrink-0 h-auto">
              <WidgetCard scrollable={false} className="h-full">
                <CalendarWidget />
              </WidgetCard>
            </ZenModeBlurWrapper>

            <ZenModeBlurWrapper className="shrink-0 h-auto">
              <WidgetCard scrollable={false} className="h-full">
                <HabitTrackerWidget />
              </WidgetCard>
            </ZenModeBlurWrapper>

            <ZenModeBlurWrapper excludeFromBlur className="flex-1 min-h-0">
              <WidgetCard scrollable={false} className="h-full">
                <MediaPlayerWidget />
              </WidgetCard>
            </ZenModeBlurWrapper>
          </div>
        </GridColumn>
      </BentoGrid>
    </DashboardLayout>
  );
}
