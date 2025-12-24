import { TasksWidget } from "@/components/widgets/TasksWidget";
import { ZenTimerWidget } from "@/components/widgets/ZenTimerWidget";
import { BrainDumpWidget } from "@/components/widgets/BrainDumpWidget";
import { CalendarWidget } from "@/components/widgets/CalendarWidget";
import { JobTrackerWidget } from "@/components/widgets/JobTrackerWidget";
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
          <div className="space-y-4 h-full">
            <TasksWidget />
            <QuickLinksWidget compact readOnly className="max-h-[360px]" />
          </div>
        </GridColumn>

        {/* Center Column - Brain Dump, Timer & Media */}
        <GridColumn span="center">
          <div className="space-y-4 h-full flex flex-col">
            <BrainDumpWidget />
            <ZenTimerWidget />
            <MediaPlayerWidget />
          </div>
        </GridColumn>

        {/* Right Column - Calendar & Job Tracker */}
        <GridColumn span="right">
          <div className="space-y-4 h-full">
            <CalendarWidget />
            <JobTrackerWidget />
          </div>
        </GridColumn>
      </BentoGrid>
    </DashboardLayout>
  );
}
