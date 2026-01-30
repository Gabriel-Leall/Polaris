import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

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

export default function LoginPage({ searchParams }: LoginPageProps) {
  const redirectTo = searchParams?.redirectTo ?? "/";

  return <LoginForm redirectTo={redirectTo} />;
}
