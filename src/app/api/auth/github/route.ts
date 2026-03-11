import { NextResponse } from "next/server";
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
  
  const state = JSON.stringify({ userId: user.id, next });
  const encodedState = Buffer.from(state).toString('base64');

  // GitHub OAuth params
  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthUrl.searchParams.set("client_id", clientId);
  githubAuthUrl.searchParams.set("redirect_uri", redirectUri);
  // We need repo read logic for widgets, and user logic for identity mapping
  githubAuthUrl.searchParams.set("scope", "repo read:user user:email");
  githubAuthUrl.searchParams.set("state", encodedState);

  return NextResponse.redirect(githubAuthUrl.toString());
}
