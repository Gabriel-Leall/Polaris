import { NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import { getServerUser } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const user = await getServerUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const clientId = process.env.GITHUB_CLIENT_ID_WIDGET;
  if (!clientId) {
    return new NextResponse("GitHub integration not configured", { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const next = searchParams.get('next') || '/settings/integrations';

  const host = new URL(request.url).origin;
  const redirectUri = `${host}/api/auth/github/callback`;

  // Generate a cryptographically random nonce and include it in the state
  // so the callback can verify the request originated here (CSRF protection).
  const nonce = crypto.randomBytes(16).toString("hex");
  const state = JSON.stringify({ userId: user.id, next, nonce });
  const encodedState = Buffer.from(state).toString('base64');

  // Persist the nonce in an HttpOnly cookie for verification in the callback.
  const cookieStore = cookies();
  cookieStore.set({
    name: "github_oauth_nonce",
    value: nonce,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });

  // GitHub OAuth params
  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthUrl.searchParams.set("client_id", clientId);
  githubAuthUrl.searchParams.set("redirect_uri", redirectUri);
  // We need repo read logic for widgets, and user logic for identity mapping
  githubAuthUrl.searchParams.set("scope", "repo read:user user:email");
  githubAuthUrl.searchParams.set("state", encodedState);

  return NextResponse.redirect(githubAuthUrl.toString());
}
