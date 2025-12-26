import { Sidebar, SidebarNav, DashboardLayout } from "@/components/layout";
import { FileText, Loader2 } from "lucide-react";

export default function NotesPage() {
  return (
    <DashboardLayout>
      <Sidebar>
        <SidebarNav activeItem="notes" />
      </Sidebar>
      <div className="flex-1 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
            Notes Archive
          </h1>
          <p className="text-secondary max-w-sm">
            Coming soon. A rich-text notes system with markdown support and
            organization.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-muted text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Under development</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
