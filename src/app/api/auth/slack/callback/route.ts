import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { encryptToken } from "@/lib/integrations/crypto";
import { getServerUser, createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const stateParam = url.searchParams.get("state");
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

  // Verify CSRF state nonce against the value stored in the cookie.
  const cookieStore = cookies();
  const storedState = cookieStore.get("slack_oauth_state")?.value;
  if (!storedState || storedState !== stateParam) {
    settingsUrl.searchParams.append("error", "invalid_state");
    return NextResponse.redirect(settingsUrl.toString());
  }
  // Consume the state cookie so it cannot be reused.
  cookieStore.delete("slack_oauth_state");

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
    const encryptedAccessToken = encryptToken(authed_user?.access_token || tokenData.access_token);
    const expiresIn = typeof tokenData.expires_in === "number" && tokenData.expires_in > 0
      ? tokenData.expires_in
      : null;
    const tokenExpiresAt = expiresIn
      ? new Date(Date.now() + expiresIn * 1000).toISOString()
      : null;

    const supabase = await createSupabaseServerClient();

    // Use maybeSingle() to avoid an error when no existing row is found.
    const { data: existingConnection, error: selectError } = await supabase
      .from("integration_connections")
      .select("id")
      .eq("user_id", user.id)
      .eq("provider", "slack")
      .maybeSingle();

    if (selectError) {
      console.error("Error checking existing connection:", selectError);
      throw new Error("Failed to check existing connection");
    }

    if (existingConnection) {
      const { error: updateError } = await supabase
        .from("integration_connections")
        .update({
          encrypted_access_token: encryptedAccessToken,
          token_expires_at: tokenExpiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingConnection.id);

      if (updateError) {
        console.error("Error updating integration connection:", updateError);
        throw new Error("Failed to update integration connection");
      }
    } else {
      const { error: insertError } = await supabase
        .from("integration_connections")
        .insert({
          user_id: user.id,
          provider: "slack",
          encrypted_access_token: encryptedAccessToken,
          token_expires_at: tokenExpiresAt,
        });

      if (insertError) {
        console.error("Error inserting integration connection:", insertError);
        throw new Error("Failed to save integration connection");
      }
    }

    settingsUrl.searchParams.append("success", "slack_connected");
    return NextResponse.redirect(settingsUrl.toString());
  } catch (err) {
    console.error("Slack integration error:", err);
    settingsUrl.searchParams.append("error", "slack_integration_error");
    return NextResponse.redirect(settingsUrl.toString());
  }
}
