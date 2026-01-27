"use client";

import React from "react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

interface AuthFormShellProps {
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  className?: string;
}

export function AuthFormShell({
  title,
  children,
  footer,
  className,
}: AuthFormShellProps) {
  return (
    <div
      className={cn(
        "w-full p-8 md:px-14 md:py-12 flex flex-col justify-center bg-main",
        className,
      )}
    >
      <div className="mb-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Logo size={24} className="text-primary-foreground" />
        </div>
        <span className="font-bold text-foreground text-xl tracking-tight">
          Polaris
        </span>
      </div>

      <div className="space-y-2 mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
          {title}
        </h1>
      </div>

      {children}

      <div className="mt-12 text-center md:text-left">{footer}</div>
    </div>
  );
}
