import { Sidebar, SidebarNav, DashboardLayout } from "@/components/layout";
import { PageTransition } from "@/components/layout/PageTransition";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <PageTransition>{children}</PageTransition>
    </DashboardLayout>
  );
}
