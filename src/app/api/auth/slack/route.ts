import { NextResponse } from "next/server";
import crypto from 'crypto';
import { cookies } from "next/headers";
import { getServerUser } from "@/lib/supabase-server";

export async function GET(_request: Request) {
  const user = await getServerUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = process.env.SLACK_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Slack Client ID not configured" }, { status: 500 });
  }

  // Generate a random state string for CSRF protection and persist it in an
  // HttpOnly cookie so the callback can verify the request originated here.
  const state = crypto.randomBytes(16).toString('hex');

  const cookieStore = cookies();
  cookieStore.set({
    name: "slack_oauth_state",
    value: state,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });
  
  const url = new URL('https://slack.com/oauth/v2/authorize');
  url.searchParams.append('client_id', clientId);
  // Specify minimum scopes required by the app
  url.searchParams.append('scope', 'channels:history,channels:read,chat:write,users:read');
  // Or if we need user scopes:
  url.searchParams.append('user_scope', 'search:read'); 
  url.searchParams.append('state', state);

  // Note: Slack redirect_uri is optional if configured in the Slack app dashboard,
  // but good practice to provide it if multiple environments are used.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  url.searchParams.append('redirect_uri', `${appUrl}/api/auth/slack/callback`);

  return NextResponse.redirect(url.toString());
}
