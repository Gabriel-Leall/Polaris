import { TasksWidget } from '@/components/widgets/TasksWidget'
import { ZenTimerWidget } from '@/components/widgets/ZenTimerWidget'
import { 
  DashboardLayout, 
  Sidebar, 
  SidebarNav,
  BentoGrid, 
  GridColumn, 
  WidgetCard 
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
        {/* Left Column - Tasks */}
        <GridColumn span="left">
          <TasksWidget />
        </GridColumn>
        
        {/* Center Column - Zen Timer */}
        <GridColumn span="center">
          <ZenTimerWidget />
        </GridColumn>
        
        {/* Right Column - Context */}
        <GridColumn span="right">
          <WidgetCard title="Context">
            <div className="text-sm text-muted">
              Context widgets will go here
            </div>
          </WidgetCard>
        </GridColumn>
      </BentoGrid>
    </DashboardLayout>
  )
}