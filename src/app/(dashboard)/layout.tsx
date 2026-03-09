import {
  ActivityBar,
  DynamicSidebar,
  DashboardLayout,
} from "@/components/layout";
import { PageTransition } from "@/components/layout/PageTransition";
import { GameNotifications } from "@/components/dashboard/GameNotifications";
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
      <ActivityBar />
      <DynamicSidebar />
      <PageTransition>{children}</PageTransition>
      <GameNotifications />
    </DashboardLayout>
  );
}
