"use client";

import React from "react";
import { AxisIcon } from "@/components/ui/AxisIcon";
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
        <div className="w-10 h-10 rounded-xl flex items-center justify-center">
          <AxisIcon size={24} interactive={false} />
        </div>
        <span className="font-bold text-foreground text-xl tracking-tight">
          Axis
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
