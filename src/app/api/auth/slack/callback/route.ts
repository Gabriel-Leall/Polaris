import { NextResponse } from "next/server";
import { encryptToken } from "@/lib/integrations/crypto";
import { getServerUser, createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const settingsUrl = new URL(`${appUrl}/settings/integrations`);

  if (error) {
    settingsUrl.searchParams.append("error", "slack_auth_failed");
    return NextResponse.redirect(settingsUrl.toString());
  }

  if (!code) {
    settingsUrl.searchParams.append("error", "missing_code");
    return NextResponse.redirect(settingsUrl.toString());
  }

  const user = await getServerUser();

  if (!user) {
    settingsUrl.searchParams.append("error", "unauthorized");
    return NextResponse.redirect(settingsUrl.toString());
  }

  try {
    const clientId = process.env.SLACK_CLIENT_ID;
    const clientSecret = process.env.SLACK_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      throw new Error("Missing Slack credentials");
    }

    const tokenResponse = await fetch("https://slack.com/api/oauth.v2.access", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${appUrl}/api/auth/slack/callback`,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.ok) {
      console.error("Slack token error:", tokenData);
      throw new Error(tokenData.error || "Failed to exchange code for token");
    }

    const { authed_user, team } = tokenData;
    const encryptedToken = encryptToken(authed_user?.access_token || tokenData.access_token);
    const expiresAt = tokenData.expires_in 
      ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
      : null;
    let metadata: any = undefined;
    if (team) {
      metadata = {
        workspace_name: team.name,
        workspace_id: team.id,
      };
    }

    const supabase = await createSupabaseServerClient();

    // Check if link exists
    const { data: existingConnection } = await supabase
      .from("integration_connections")
      .select("id")
      .eq("user_id", user.id)
      .eq("provider", "slack")
      .single();

    if (existingConnection) {
      // Update
      await supabase
        .from("integration_connections")
        .update({
          encrypted_token: encryptedToken,
          status: "connected",
          expires_at: expiresAt,
          metadata
        })
        .eq("id", existingConnection.id);
    } else {
      // Insert
      await supabase
        .from("integration_connections")
        .insert({
          user_id: user.id,
          provider: "slack",
          encrypted_token: encryptedToken,
          status: "connected",
          expires_at: expiresAt,
          metadata
        });
    }

    settingsUrl.searchParams.append("success", "slack_connected");
    return NextResponse.redirect(settingsUrl.toString());
  } catch (err) {
    console.error("Slack integration error:", err);
    settingsUrl.searchParams.append("error", "slack_integration_error");
    return NextResponse.redirect(settingsUrl.toString());
  }
}
