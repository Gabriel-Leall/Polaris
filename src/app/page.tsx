import { TasksWidget } from '@/components/widgets/TasksWidget'
import { ZenTimerWidget } from '@/components/widgets/ZenTimerWidget'
import { BrainDumpWidget } from '@/components/widgets/BrainDumpWidget'
import { CalendarWidget } from '@/components/widgets/CalendarWidget'
import { JobTrackerWidget } from '@/components/widgets/JobTrackerWidget'
import { MediaPlayerWidget } from '@/components/widgets/MediaPlayerWidget'
import { QuickLinksWidget } from '@/components/widgets/QuickLinksWidget'
import { 
  DashboardLayout, 
  Sidebar, 
  SidebarNav,
  BentoGrid, 
  GridColumn
} from '@/components/layout'

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* Sidebar */}
      <Sidebar>
        <SidebarNav activeItem="dashboard" />
      </Sidebar>
      
      {/* Main Content Grid */}
      <BentoGrid>
        {/* Left Column - Tasks & Calendar */}
        <GridColumn span="left">
          <div className="space-y-6 h-full">
            <TasksWidget />
            <CalendarWidget />
          </div>
        </GridColumn>
        
        {/* Center Column - Brain Dump (Main Focus) */}
        <GridColumn span="center">
          <BrainDumpWidget />
        </GridColumn>
        
        {/* Right Column - Context & Tools */}
        <GridColumn span="right">
          <div className="space-y-6 h-full">
            <ZenTimerWidget />
            <JobTrackerWidget />
            <MediaPlayerWidget />
            <QuickLinksWidget />
          </div>
        </GridColumn>
      </BentoGrid>
    </DashboardLayout>
  )
}