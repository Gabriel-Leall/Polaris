"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function submitFeedback(userId: string, message: string) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("feedback")
    .insert({
      user_id: userId,
      message: message.trim(),
    });

  if (error) throw error;
  
  revalidatePath("/feedback");
  return { success: true };
}

export async function getFeedback() {
  const supabase = await createSupabaseServerClient();

  const { data: feedback, error } = await supabase
    .from("feedback")
    .select(`
      id,
      message,
      created_at,
      user_id,
      profiles (
        full_name,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  
  return feedback;
}

export async function deleteFeedback(feedbackId: string) {
  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase
    .from("feedback")
    .delete()
    .eq("id", feedbackId);
    
  if (error) throw error;
  
  revalidatePath("/feedback");
  return { success: true };
}
