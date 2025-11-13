import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // In production, set this to your specific domains
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// List of disposable email domains to block
const DISPOSABLE_DOMAINS = [
  "tempmail.com",
  "guerrillamail.com",
  "10minutemail.com",
  "mailinator.com",
  "throwaway.email",
  "fakeinbox.com",
  "temp-mail.org",
  "getnada.com",
  "maildrop.cc",
  "trashmail.com",
  "yopmail.com",
  "sharklasers.com",
  "guerrillamailblock.com",
  "spam4.me",
  "grr.la",
  "dispostable.com",
  "mintemail.com",
];

function validateEmail(email: string): { valid: boolean; error?: string } {
  // Basic format validation
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Invalid email format" };
  }

  // Check for disposable email domains
  const domain = email.split("@")[1]?.toLowerCase();
  if (DISPOSABLE_DOMAINS.includes(domain)) {
    return { valid: false, error: "Disposable email addresses are not allowed" };
  }

  // Additional checks
  if (email.length > 254) {
    return { valid: false, error: "Email address is too long" };
  }

  return { valid: true };
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, product, metadata = {} } = body;

    // Validate required fields
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!product || typeof product !== "string") {
      return NextResponse.json(
        { success: false, error: "Product identifier is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Validate email
    const validation = validateEmail(normalizedEmail);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400, headers: corsHeaders }
      );
    }

    // Create Supabase client
    const supabase = await createSupabaseServerClient();

    // Use the upsert_lead function to handle insert/update logic
    const { data, error } = await supabase.rpc("upsert_lead", {
      p_email: normalizedEmail,
      p_product: product,
      p_metadata: {
        ...metadata,
        captured_at: new Date().toISOString(),
        user_agent: request.headers.get("user-agent") || "unknown",
        referer: request.headers.get("referer") || "direct",
      },
    });

    if (error) {
      console.error("Error upserting lead:", error);
      return NextResponse.json(
        { success: false, error: "Failed to save lead" },
        { status: 500, headers: corsHeaders }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: data.message || "Successfully subscribed",
      leadId: data.lead_id,
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error in lead capture API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Optional: GET endpoint to check if an email is already subscribed
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const product = searchParams.get("product");

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email parameter is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("leads")
      .select("id, products, status")
      .eq("email", email.trim().toLowerCase())
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return NextResponse.json({
          success: true,
          subscribed: false,
        });
      }
      throw error;
    }

    const isSubscribedToProduct = product
      ? data.products.includes(product)
      : data.products.length > 0;

    return NextResponse.json({
      success: true,
      subscribed: isSubscribedToProduct,
      status: data.status,
      products: data.products,
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error checking lead subscription:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

