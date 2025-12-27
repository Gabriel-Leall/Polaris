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
            <WidgetCard scrollable={false} className="flex-1 min-h-0">
              <TasksWidget />
            </WidgetCard>

            <WidgetCard scrollable={false} className="shrink-0 h-[180px]">
              <QuickLinksWidget compact readOnly />
            </WidgetCard>
          </div>
        </GridColumn>

        {/* Center Column - Brain Dump & Timer */}
        <GridColumn span="center">
          <div className="flex flex-col gap-4 h-full">
            <WidgetCard scrollable={false} className="flex-1 min-h-0">
              <BrainDumpWidget />
            </WidgetCard>

            <WidgetCard
              scrollable={false}
              className="shrink-0 h-[25%] min-h-[180px]"
            >
              <ZenTimerWidget />
            </WidgetCard>
          </div>
        </GridColumn>

        {/* Right Column - Calendar, Habits & Media */}
        <GridColumn span="right">
          <div className="flex flex-col gap-4 h-full">
            <WidgetCard scrollable={false} className="shrink-0 h-auto">
              <CalendarWidget />
            </WidgetCard>

            <WidgetCard scrollable={false} className="shrink-0 h-auto">
              <HabitTrackerWidget />
            </WidgetCard>

            <WidgetCard scrollable={false} className="flex-1 min-h-0">
              <MediaPlayerWidget />
            </WidgetCard>
          </div>
        </GridColumn>
      </BentoGrid>
    </DashboardLayout>
  );
}
