import { SignupForm } from "@/components/auth/SignupForm";
import { getServerUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const user = await getServerUser();

  if (user) {
    redirect("/dashboard");
  }

  return <SignupForm />;
}
