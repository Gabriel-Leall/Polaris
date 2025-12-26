import { TasksWidget } from "@/components/widgets/TasksWidget";
import { ZenTimerWidget } from "@/components/widgets/ZenTimerWidget";
import { BrainDumpWidget } from "@/components/widgets/BrainDumpWidget";
import { CalendarWidget } from "@/components/widgets/CalendarWidget";
import { HabitTrackerWidget } from "@/components/widgets/HabitTrackerWidget";
import { MediaPlayerWidget } from "@/components/widgets/MediaPlayerWidget";
import { QuickLinksWidget } from "@/components/widgets/QuickLinksWidget";
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

      {/* Main Content Grid */}
      <BentoGrid>
        {/* Left Column - Tasks & Quick Links */}
        <GridColumn span="left">
          <div className="flex flex-col gap-4 h-full">
            <div className="flex-1 min-h-0 bg-card rounded-2xl border border-white/5 p-4">
              <TasksWidget />
            </div>
            <div className="h-[200px] shrink-0 bg-card rounded-2xl border border-white/5 p-4">
              <QuickLinksWidget compact readOnly />
            </div>
          </div>
        </GridColumn>

        {/* Center Column - Brain Dump, Timer & Media */}
        <GridColumn span="center">
          <div className="flex flex-col gap-4 h-full">
            <div className="flex-[2] min-h-0 bg-card rounded-2xl border border-white/5 p-4">
              <BrainDumpWidget />
            </div>
            <div className="h-[160px] shrink-0 bg-card rounded-2xl border border-white/5 p-4">
              <ZenTimerWidget />
            </div>
            <div className="h-[120px] shrink-0 bg-card rounded-2xl border border-white/5 p-4">
              <MediaPlayerWidget />
            </div>
          </div>
        </GridColumn>

        {/* Right Column - Calendar & Habit Tracker */}
        <GridColumn span="right">
          <div className="flex flex-col gap-4 h-full">
            <div className="h-[280px] shrink-0 bg-card rounded-2xl border border-white/5 p-4">
              <CalendarWidget />
            </div>
            <div className="flex-1 min-h-0 bg-card rounded-2xl border border-white/5 p-4">
              <HabitTrackerWidget />
            </div>
          </div>
        </GridColumn>
      </BentoGrid>
    </DashboardLayout>
  );
}
