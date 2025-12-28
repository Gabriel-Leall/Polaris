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
  ZenModeBlurWrapper,
} from "@/components/layout";
import { WidgetCard } from "@/components/layout/WidgetCard";

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
            {/* Tasks Widget - Blurred in Zen Mode */}
            <ZenModeBlurWrapper className="flex-1 min-h-0">
              <WidgetCard scrollable={false} className="h-full">
                <TasksWidget />
              </WidgetCard>
            </ZenModeBlurWrapper>

            {/* Quick Links Widget - Blurred in Zen Mode */}
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
            {/* Brain Dump Widget - NOT blurred in Zen Mode */}
            <ZenModeBlurWrapper excludeFromBlur className="flex-1 min-h-0">
              <WidgetCard scrollable={false} className="h-full">
                <BrainDumpWidget />
              </WidgetCard>
            </ZenModeBlurWrapper>

            {/* Zen Timer Widget - NOT blurred in Zen Mode */}
            <ZenModeBlurWrapper excludeFromBlur className="shrink-0 h-[25%] min-h-[180px]">
              <WidgetCard scrollable={false} className="h-full">
                <ZenTimerWidget />
              </WidgetCard>
            </ZenModeBlurWrapper>
          </div>
        </GridColumn>

        {/* Right Column - Calendar, Habits & Media */}
        <GridColumn span="right">
          <div className="flex flex-col gap-4 h-full">
            {/* Calendar Widget - Blurred in Zen Mode */}
            <ZenModeBlurWrapper className="shrink-0 h-auto">
              <WidgetCard scrollable={false} className="h-full">
                <CalendarWidget />
              </WidgetCard>
            </ZenModeBlurWrapper>

            {/* Habit Tracker Widget - Blurred in Zen Mode */}
            <ZenModeBlurWrapper className="shrink-0 h-auto">
              <WidgetCard scrollable={false} className="h-full">
                <HabitTrackerWidget />
              </WidgetCard>
            </ZenModeBlurWrapper>

            {/* Media Player Widget - NOT blurred in Zen Mode */}
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
