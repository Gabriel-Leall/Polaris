import { TasksWidget } from '@/components/widgets/TasksWidget'
import { 
  DashboardLayout, 
  Sidebar, 
  BentoGrid, 
  GridColumn, 
  WidgetCard 
} from '@/components/layout'

export default function Dashboard() {
  return (
    <DashboardLayout>
      {/* Sidebar */}
      <Sidebar>
        <nav className="space-y-2">
          <div className="text-sm text-muted">Navigation items will go here</div>
        </nav>
      </Sidebar>
      
      {/* Main Content Grid */}
      <BentoGrid>
        {/* Left Column - Tasks */}
        <GridColumn span="left">
          <TasksWidget />
        </GridColumn>
        
        {/* Center Column - Brain Dump */}
        <GridColumn span="center">
          <WidgetCard title="Brain Dump">
            <div className="text-sm text-muted">
              Brain dump widget content will go here
            </div>
          </WidgetCard>
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