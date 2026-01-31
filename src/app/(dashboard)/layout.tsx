import { Sidebar, SidebarNav, DashboardLayout } from "@/components/layout";
import { PageTransition } from "@/components/layout/PageTransition";
import { getServerUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  if (!user) {
    redirect("/login?redirectTo=/dashboard");
  }

  return (
    <DashboardLayout>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <PageTransition>{children}</PageTransition>
    </DashboardLayout>
  );
}
