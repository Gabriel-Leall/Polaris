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

/**
 * Dashboard - Main page component
 * 
 * Layout Structure (12-column grid):
 * - Left Column (3 cols): Tasks (full height) + Quick Links (fixed height)
 * - Center Column (5 cols): Brain Dump (flex-1) + Zen Timer (fixed height)
 * - Right Column (4 cols): Calendar + Habit Tracker + Media Player
 * 
 * Zen Mode Behavior:
 * - Blurred: Tasks, Quick Links, Calendar, Habit Tracker
 * - Not Blurred: Zen Timer, Media Player, Brain Dump
 * 
 * Accessibility:
 * - Skip link for keyboard navigation
 * - Proper ARIA labels on all widgets
 * - Focus management during Zen Mode
 */
export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* Skip Link for Keyboard Navigation */}
      <a
        href="#main-content"
        className="skip-link"
      >
        Skip to main content
      </a>

      {/* Sidebar */}
      <Sidebar>
        <SidebarNav activeItem="dashboard" />
      </Sidebar>

      {/* Main Content Grid - Bento Layout */}
      <BentoGrid id="main-content" role="main" aria-label="Dashboard widgets">
        {/* Left Column - Tasks & Quick Links */}
        <GridColumn span="left">
          <div className="flex flex-col gap-4 h-full">
            {/* Tasks Widget - Blurred in Zen Mode */}
            <ZenModeBlurWrapper 
              className="flex-1 min-h-0" 
              aria-label="Tasks section"
            >
              <WidgetCard 
                scrollable={false} 
                className="h-full"
                aria-label="My Tasks"
              >
                <TasksWidget />
              </WidgetCard>
            </ZenModeBlurWrapper>

            {/* Quick Links Widget - Blurred in Zen Mode */}
            <ZenModeBlurWrapper 
              className="shrink-0 h-[180px]"
              aria-label="Quick Links section"
            >
              <WidgetCard 
                scrollable={false} 
                className="h-full"
                aria-label="Quick Links"
              >
                <QuickLinksWidget compact readOnly />
              </WidgetCard>
            </ZenModeBlurWrapper>
          </div>
        </GridColumn>

        {/* Center Column - Brain Dump & Timer (Main Focus Area) */}
        <GridColumn span="center">
          <div className="flex flex-col gap-4 h-full">
            {/* Brain Dump Widget - NOT blurred in Zen Mode */}
            <ZenModeBlurWrapper 
              excludeFromBlur 
              className="flex-1 min-h-0"
              aria-label="Brain Dump section - remains active during Zen Mode"
            >
              <WidgetCard 
                scrollable={false} 
                className="h-full"
                aria-label="Brain Dump Editor"
              >
                <BrainDumpWidget />
              </WidgetCard>
            </ZenModeBlurWrapper>

            {/* Zen Timer Widget - NOT blurred in Zen Mode */}
            <ZenModeBlurWrapper 
              excludeFromBlur 
              className="shrink-0 h-[25%] min-h-[200px]"
              aria-label="Zen Timer section - remains active during Zen Mode"
            >
              <WidgetCard 
                scrollable={false} 
                className="h-full"
                aria-label="Zen Timer"
              >
                <ZenTimerWidget />
              </WidgetCard>
            </ZenModeBlurWrapper>
          </div>
        </GridColumn>

        {/* Right Column - Calendar, Habits & Media */}
        <GridColumn span="right">
          <div className="flex flex-col gap-4 h-full">
            {/* Calendar Widget - Blurred in Zen Mode */}
            <ZenModeBlurWrapper 
              className="shrink-0"
              aria-label="Calendar section"
            >
              <WidgetCard 
                scrollable={false}
                aria-label="Calendar"
              >
                <CalendarWidget />
              </WidgetCard>
            </ZenModeBlurWrapper>

            {/* Habit Tracker Widget - Blurred in Zen Mode */}
            <ZenModeBlurWrapper 
              className="shrink-0"
              aria-label="Habit Tracker section"
            >
              <WidgetCard 
                scrollable={false}
                aria-label="Habit Tracker"
              >
                <HabitTrackerWidget />
              </WidgetCard>
            </ZenModeBlurWrapper>

            {/* Media Player Widget - NOT blurred in Zen Mode */}
            <ZenModeBlurWrapper 
              excludeFromBlur 
              className="flex-1 min-h-[180px]"
              aria-label="Media Player section - remains active during Zen Mode"
            >
              <WidgetCard 
                scrollable={false} 
                className="h-full"
                aria-label="Media Player"
              >
                <MediaPlayerWidget />
              </WidgetCard>
            </ZenModeBlurWrapper>
          </div>
        </GridColumn>
      </BentoGrid>
    </DashboardLayout>
  );
}
