"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { unstable_noStore as noStore } from "next/cache";

export async function getProfileStats(userId: string) {
  noStore();
  const supabase = await createSupabaseServerClient();

  // 1. Tasks Done
  const { count: tasksDone, error: tasksError } = await supabase
    .from("tasks")
    .select("id", { count: "exact" })
    .eq("user_id", userId)
    .eq("completed", true);

  if (tasksError) console.error("Error fetching tasks count:", tasksError);

  // 2. Projects (Brain Dump Notes)
  const { count: notesCount, error: notesError } = await supabase
    .from("brain_dump_notes")
    .select("id", { count: "exact" })
    .eq("user_id", userId);

  if (notesError) console.error("Error fetching notes count:", notesError);

  // 3. Profiles data (Focus and Zen Time)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("usage_count, total_zen_seconds")
    .eq("id", userId)
    .maybeSingle(); // Use maybeSingle() to avoid error if row doesn't exist

  if (profileError) console.error("Error fetching profile stats:", profileError);

  return {
    tasksDone: tasksDone ?? 0,
    projects: notesCount ?? 0,
    focus: profile?.usage_count ?? 0,
    zenTime: (profile?.total_zen_seconds ?? 0) / 3600, // Convert to hours
  };
}

export async function updateAvatar(userId: string, avatarUrl: string) {
  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", userId);

  if (error) throw error;
  return { success: true };
}

export async function trackUsage(userId: string) {
  const supabase = await createSupabaseServerClient();
  
  // Increment usage_count
  const { data: profile } = await supabase
    .from("profiles")
    .select("usage_count")
    .eq("id", userId)
    .maybeSingle();
    
  await supabase
    .from("profiles")
    .upsert({ 
      id: userId, 
      usage_count: (profile?.usage_count || 0) + 1,
      updated_at: new Date().toISOString()
    });
}

export async function addZenTime(userId: string, seconds: number) {
  const supabase = await createSupabaseServerClient();
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("total_zen_seconds")
    .eq("id", userId)
    .maybeSingle();
    
  await supabase
    .from("profiles")
    .upsert({ 
      id: userId, 
      total_zen_seconds: (profile?.total_zen_seconds || 0) + seconds,
      updated_at: new Date().toISOString()
    });
}
