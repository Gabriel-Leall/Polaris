import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { encryptToken } from "@/lib/integrations/crypto";
import { createSupabaseServerClient, getServerUser } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const encodedState = searchParams.get('state');

  if (!code || !encodedState) {
    return new NextResponse("Missing params", { status: 400 });
  }

  // Decode state
  let stateObj: any = {};
  try {
    const stateStr = Buffer.from(encodedState, 'base64').toString('utf-8');
    stateObj = JSON.parse(stateStr);
  } catch (error) {
    return new NextResponse("Invalid state", { status: 400 });
  }

  // Verify the CSRF nonce stored in the cookie matches the one in state.
  const cookieStore = cookies();
  const storedNonce = cookieStore.get("github_oauth_nonce")?.value;
  if (!storedNonce || storedNonce !== stateObj.nonce) {
    // Consume the nonce on failure so it cannot be reused.
    cookieStore.delete("github_oauth_nonce");
    return new NextResponse("Invalid state nonce", { status: 400 });
  }
  // Consume the nonce so it cannot be reused.
  cookieStore.delete("github_oauth_nonce");

  const user = await getServerUser();
  if (!user || user.id !== stateObj.userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const host = new URL(request.url).origin;
  const redirectUri = `${host}/api/auth/github/callback`;
  const clientId = process.env.GITHUB_CLIENT_ID_WIDGET;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET_WIDGET;

  if (!clientId || !clientSecret) {
    return new NextResponse("GitHub missing config", { status: 500 });
  }

  // Request access token from GitHub
  const tokenUrl = "https://github.com/login/oauth/access_token";
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: redirectUri,
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = await response.json();
  const accessToken = data.access_token;
  
  if (!accessToken) {
    console.error("GitHub token exchange failed:", data);
    return new NextResponse("Failed to exchange token", { status: 400 });
  }

  // Encrypt the token before storing it.
  const encryptedAccessToken = encryptToken(accessToken);

  // Save to database using the correct schema column names.
  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase
    .from("integration_connections")
    .upsert({
      user_id: user.id,
      provider: "github",
      encrypted_access_token: encryptedAccessToken,
      updated_at: new Date().toISOString()
    }, {
      onConflict: "user_id, provider"
    });

  if (error) {
    console.error("DB Save error", error);
    return new NextResponse("Failed to save integration", { status: 500 });
  }

  // Redirect back
  const nextPath = stateObj.next || '/settings/integrations';
  return NextResponse.redirect(`${host}${nextPath}`);
}
