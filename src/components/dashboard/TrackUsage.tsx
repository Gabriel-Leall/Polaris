"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { trackUsage } from "@/app/actions/profile";

export function TrackUsage() {
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      // Track usage once per session/mount
      trackUsage(userId).catch(console.error);
    }
  }, [userId]);

  return null;
}
