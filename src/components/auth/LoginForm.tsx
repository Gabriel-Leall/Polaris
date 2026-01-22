"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { signIn } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthFormShell } from "./AuthFormShell";
import { SocialAuthButtons } from "./SocialAuthButtons";

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo = "/" }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);

    formData.append("redirectTo", redirectTo);
    const result = await signIn(formData);

    if (result && !result.success && result.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <AuthFormShell
      title="Sign in"
      footer={
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account? 
          <Link className="text-white font-medium hover:underline ml-1" href="/signup">
            Sign up
          </Link>
        </p>
      }
    >
      <div className="space-y-6">
        <form action={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest" htmlFor="email">
              Your email
            </label>
            <Input 
              className="w-full px-4 py-3 bg-card border-white/[0.03] focus:border-white/10 focus:ring-0 text-white rounded-xl transition-all outline-none h-12 placeholder:text-muted-foreground/70" 
              id="email" 
              name="email"
              placeholder="charles@polaris.app" 
              type="email"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest" htmlFor="password">
                Password
              </label>
              <Link className="text-[10px] font-bold text-muted-foreground hover:text-white transition-colors" href="#">
                Forget password?
              </Link>
            </div>
            <Input 
              className="w-full px-4 py-3 bg-card border-white/[0.03] focus:border-white/10 focus:ring-0 text-white rounded-xl transition-all outline-none h-12 placeholder:text-muted-foreground/70" 
              id="password" 
              name="password"
              placeholder="••••••••••••" 
              type="password"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-500 font-medium">{error}</p>
            </div>
          )}
          
          <Button 
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all active:scale-[0.98] mt-2 border-transparent shadow-none" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="relative pt-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/[0.05]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-main px-4 text-muted-foreground font-bold tracking-[0.2em]">Or continue with</span>
          </div>
        </div>

        <SocialAuthButtons />
      </div>
    </AuthFormShell>
  );
}
