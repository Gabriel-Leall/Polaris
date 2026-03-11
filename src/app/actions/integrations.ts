"use server";

import { createSupabaseServerClient, getServerUser } from "@/lib/supabase-server";
import { decryptToken } from "@/lib/integrations/crypto";
import { IntegrationProvider } from "@/types/integrations";

/**
 * Disconnects an integration by provider ID.
 */
export async function disconnectIntegration(provider: IntegrationProvider) {
  const user = await getServerUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("integration_connections")
    .delete()
    .eq("user_id", user.id)
    .eq("provider", provider);

  if (error) {
    console.error("Error disconnecting integration:", error);
    return { success: false, error: "Failed to disconnect integration" };
  }

  return { success: true };
}

/**
 * Fetches all saved integration connections for the current user.
 */
export async function getActiveIntegrations() {
  const user = await getServerUser();

  if (!user) {
    return { success: false, error: "Unauthorized", data: [] };
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("integration_connections")
    .select("id, provider, created_at, updated_at, token_expires_at")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching active integrations:", error);
    return { success: false, error: "Failed to fetch integrations", data: [] };
  }

  return { success: true, data };
}

/**
 * Fetches recent GitHub issues using the saved integration token.
 */
export async function fetchGitHubIssues() {
  const user = await getServerUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("integration_connections")
    .select("encrypted_access_token")
    .eq("user_id", user.id)
    .eq("provider", "github")
    .single();

  if (error || !data?.encrypted_access_token) {
    return { success: false, error: "GitHub integration not connected" };
  }

  let token: string;
  try {
    token = decryptToken(data.encrypted_access_token);
  } catch (decryptErr) {
    console.error("Failed to decrypt GitHub token:", decryptErr);
    return { success: false, error: "Failed to decrypt integration token" };
  }
  
  try {
    const res = await fetch("https://api.github.com/issues?filter=all&state=open&sort=updated", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
      // Ensure we don't cache this aggressively for typical user requests,
      // but caching could be managed on client-side or React Query.
      cache: 'no-store'
    });

    if (!res.ok) {
      if (res.status === 401) {
        // Token expired/revoked
        await disconnectIntegration("github");
        return { success: false, error: "Token expired. Disconnected integration." };
      }
      return { success: false, error: "Failed to fetch issues from GitHub" };
    }

    const issues = await res.json();
    
    // Map to simplified data structure
    const mappedIssues = issues.slice(0, 5).map((issue: any) => ({
      id: issue.id,
      title: issue.title,
      url: issue.html_url,
      repo: issue.repository?.full_name || "Unknown Repo",
      number: issue.number,
      createdAt: issue.created_at,
      state: issue.state,
    }));

    return { success: true, data: mappedIssues };
  } catch (err) {
    console.error("Error fetching github issues:", err);
    return { success: false, error: "Network error fetching GitHub data" };
  }
}
