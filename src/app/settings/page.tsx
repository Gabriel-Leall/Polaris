import { DashboardLayout, Sidebar, SidebarNav } from "@/components/layout";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <Sidebar>
        <SidebarNav />
      </Sidebar>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <Settings className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Coming soon. Personalize your Polaris experience.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
