import { Sidebar, SidebarNav, DashboardLayout } from "@/components/layout";
import { QuickLinksWidget } from "@/components/widgets/QuickLinksWidget";

export default function QuickLinksPage() {
  return (
    <DashboardLayout>
      <Sidebar>
        <SidebarNav activeItem="quick-links" />
      </Sidebar>
      <div className="flex-1 h-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-2 lg:p-6">
        <div className="lg:col-span-2">
          <QuickLinksWidget />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-card rounded-3xl border border-glass p-6">
            <h2 className="text-sm font-semibold text-white">How to use</h2>
            <p className="text-sm text-secondary mt-2">
              Manage your saved links here. Add new URLs, edit icons and
              categories. The dashboard shows a compact read-only snapshot; full
              configuration lives on this page.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
