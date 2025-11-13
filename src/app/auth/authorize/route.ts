import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * OAuth Authorization Endpoint
 * 
 * This endpoint initiates the OAuth flow for CyberWorld products.
 * 
 * Query Parameters:
 * - client_id: The product identifier (e.g., 'eternaguard', 'studio')
 * - redirect_uri: Where to send the user after authentication
 * - state: Optional state parameter for CSRF protection
 * - response_type: Should be 'code' (authorization code flow)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const clientId = searchParams.get("client_id");
  const redirectUri = searchParams.get("redirect_uri");
  const state = searchParams.get("state");
  const responseType = searchParams.get("response_type") || "code";

  // Validate required parameters
  if (!clientId) {
    return NextResponse.json(
      { error: "missing_client_id", error_description: "client_id parameter is required" },
      { status: 400 }
    );
  }

  if (!redirectUri) {
    return NextResponse.json(
      { error: "missing_redirect_uri", error_description: "redirect_uri parameter is required" },
      { status: 400 }
    );
  }

  // Validate client_id against allowed products
  const allowedClients = ["eternaguard", "studio", "gateway"];
  if (!allowedClients.includes(clientId)) {
    return NextResponse.json(
      { error: "invalid_client", error_description: "Unknown client_id" },
      { status: 400 }
    );
  }

  // Validate redirect_uri against allowed URIs for this client
  const allowedRedirectUris: Record<string, string[]> = {
    eternaguard: [
      "http://localhost:3001/auth/callback",
      "http://10.0.0.201:3001/auth/callback",
      "https://eternaguard.cyberworldbuilders.com/auth/callback",
    ],
    studio: [
      "http://localhost:3002/auth/callback",
      "http://10.0.0.201:3002/auth/callback",
      "https://studio.cyberworldbuilders.com/auth/callback",
    ],
    gateway: [
      "http://localhost:3000/auth/callback",
      "http://10.0.0.201:3000/auth/callback",
      "https://gateway.cyberworldbuilders.com/auth/callback",
    ],
  };

  if (!allowedRedirectUris[clientId]?.includes(redirectUri)) {
    return NextResponse.json(
      { error: "invalid_redirect_uri", error_description: "redirect_uri not allowed for this client" },
      { status: 400 }
    );
  }

  // Check if user is already authenticated
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    // User is already logged in, redirect back with auth code
    // For now, we'll use the session access_token as the code
    // In production, you'd generate a temporary authorization code
    const authCode = session.access_token;
    
    const callbackUrl = new URL(redirectUri);
    callbackUrl.searchParams.set("code", authCode);
    if (state) {
      callbackUrl.searchParams.set("state", state);
    }

    return NextResponse.redirect(callbackUrl);
  }

  // User not logged in, redirect to login page with return URL
  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set("client_id", clientId);
  loginUrl.searchParams.set("redirect_uri", redirectUri);
  if (state) {
    loginUrl.searchParams.set("state", state);
  }
  loginUrl.searchParams.set("response_type", responseType);

  return NextResponse.redirect(loginUrl);
}

