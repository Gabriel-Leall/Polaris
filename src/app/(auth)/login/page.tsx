import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { getServerUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Axis - Focus Dashboard",
  icons: {
    icon: [{ url: "/Axis%20Logo.svg", type: "image/svg+xml" }],
  },
};

interface LoginPageProps {
  searchParams?: {
    redirectTo?: string;
  };
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getServerUser();

  if (user) {
    redirect("/dashboard");
  }

  const redirectTo = searchParams?.redirectTo ?? "/";

  return <LoginForm redirectTo={redirectTo} />;
}
