"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signUp } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AuthFormShell } from "./AuthFormShell";
import { SocialAuthButtons } from "./SocialAuthButtons";

export const SignupForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    const result = await signUp(formData);

    if (result && !result.success && result.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <AuthFormShell
      title="Create account"
      footer={
        <p className="text-sm text-muted-foreground">
          Already have an account?
          <Link
            className="text-primary font-medium hover:underline ml-1"
            href="/login"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <div className="space-y-6">
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]"
              htmlFor="fullName"
            >
              Name
            </label>
            <Input
              className="w-full px-4 py-3 bg-card border-border focus:border-primary/50 focus:ring-0 text-foreground rounded-xl transition-all outline-none h-12 placeholder:text-muted-foreground/70"
              id="fullName"
              name="fullName"
              placeholder="Charles Miller"
              type="text"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <label
              className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]"
              htmlFor="email"
            >
              Email
            </label>
            <Input
              className="w-full px-4 py-3 bg-card border-border focus:border-primary/50 focus:ring-0 text-foreground rounded-xl transition-all outline-none h-12 placeholder:text-muted-foreground/70"
              id="email"
              name="email"
              placeholder="charles@polaris.app"
              type="email"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <label
              className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]"
              htmlFor="password"
            >
              Password
            </label>
            <Input
              className="w-full px-4 py-3 bg-card border-border focus:border-primary/50 focus:ring-0 text-foreground rounded-xl transition-all outline-none h-12 placeholder:text-muted-foreground/70"
              id="password"
              name="password"
              placeholder="••••••••••••"
              type="password"
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-500 font-medium">{error}</p>
            </div>
          )}

          <Button
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all active:scale-[0.98] mt-4 border-transparent shadow-none"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              "Sign up"
            )}
          </Button>
        </form>

        <div className="relative pt-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-main px-4 text-muted-foreground font-bold tracking-[0.2em]">
              Or continue with social
            </span>
          </div>
        </div>

        <SocialAuthButtons />
      </div>
    </AuthFormShell>
  );
};
