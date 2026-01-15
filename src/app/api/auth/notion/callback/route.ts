import { NextRequest, NextResponse } from "next/server";
import { exchangeNotionCodeForToken } from "@/app/actions/notion";
import { getServerUser } from "@/lib/supabase-server";
import { getOrCreateUserPreferences, updateUserPreferences } from "@/app/actions/userPreferences";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/?error=notion_auth_failed", request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // 1. Get the current user
    const user = await getServerUser();
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 2. Exchange code for Notion access token
    const notionData = await exchangeNotionCodeForToken(code);

    // 3. Get or create user preferences
    const preferences = await getOrCreateUserPreferences(user.id);

    // 4. Update preferences with Notion token
    // Note: The database ID might be in duplicated_template_id if the user used a template flow,
    // but usually in a SaaS we want them to select it or we provide a template.
    // For now, we store the token.
    await updateUserPreferences(preferences.id, {
      notionApiKey: notionData.accessToken,
      // If we got a template id, we could use it as initial database ID
      notionDatabaseId: notionData.duplicatedTemplateId || preferences.notionDatabaseId,
    });

    // 5. Redirect back to dashboard with success
    return NextResponse.redirect(new URL("/?notion_connected=true", request.url));
  } catch (err) {
    console.error("=== Notion Callback Error Detail ===");
    if (err instanceof Error) {
      console.error("Message:", err.message);
      console.error("Stack:", err.stack);
    } else {
      console.error("Unknown error:", err);
    }
    console.error("====================================");
    
    // Pass the message to URL to see it in the UI (optional, helpful for debug)
    const errorMessage = err instanceof Error ? encodeURIComponent(err.message) : "notion_sync_error";
    return NextResponse.redirect(new URL(`/?error=${errorMessage}`, request.url));
  }
}
