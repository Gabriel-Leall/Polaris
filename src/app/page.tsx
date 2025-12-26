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
          <div className="flex flex-col gap-3 h-full">
            {/* Tasks - Expandable area */}
            <div className="flex-1 min-h-0 bg-card rounded-2xl border border-white/5 p-4 overflow-hidden">
              <TasksWidget />
            </div>
            {/* Quick Links - Fixed compact */}
            <div className="h-[180px] shrink-0 bg-card rounded-2xl border border-white/5 p-4">
              <QuickLinksWidget compact readOnly />
            </div>
          </div>
        </GridColumn>

        {/* Center Column - Brain Dump, Timer & Media */}
        <GridColumn span="center">
          <div className="flex flex-col gap-3 h-full">
            {/* Brain Dump - Main focus area */}
            <div className="flex-1 min-h-0 bg-card rounded-2xl border border-white/5 p-4 overflow-hidden">
              <BrainDumpWidget />
            </div>
            {/* Bottom row: Timer + Media side by side */}
            <div className="h-[140px] shrink-0 flex gap-3">
              <div className="flex-1 bg-card rounded-2xl border border-white/5 p-4">
                <ZenTimerWidget />
              </div>
              <div className="flex-1 bg-card rounded-2xl border border-white/5 p-4">
                <MediaPlayerWidget />
              </div>
            </div>
          </div>
        </GridColumn>

        {/* Right Column - Calendar & Habit Tracker */}
        <GridColumn span="right">
          <div className="flex flex-col gap-3 h-full">
            {/* Calendar - Fixed height */}
            <div className="h-[260px] shrink-0 bg-card rounded-2xl border border-white/5 p-4">
              <CalendarWidget />
            </div>
            {/* Habit Tracker - Expandable area */}
            <div className="flex-1 min-h-0 bg-card rounded-2xl border border-white/5 p-4 overflow-hidden">
              <HabitTrackerWidget />
            </div>
          </div>
        </GridColumn>
      </BentoGrid>
    </DashboardLayout>
  );
}
