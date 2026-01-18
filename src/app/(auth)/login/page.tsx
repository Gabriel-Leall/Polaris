"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { Loader2 } from "lucide-react";

function LoginContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  return <LoginForm redirectTo={redirectTo} />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-secondary text-sm">Loading LoginForm...</p>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
