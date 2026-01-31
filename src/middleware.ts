import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware passthrough.
 * Auth is enforced on the server (layouts/pages) to avoid Edge Runtime warnings from Supabase.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}
