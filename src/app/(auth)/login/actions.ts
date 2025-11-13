'use server';

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthFormState = {
  error?: string;
};

export async function loginAction(
  _prevState: AuthFormState | undefined,
  formData: FormData,
): Promise<AuthFormState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = (formData.get("redirectTo") as string | null) ?? "/dashboard";
  
  // OAuth parameters
  const clientId = formData.get("client_id") as string | null;
  const redirectUri = formData.get("redirect_uri") as string | null;
  const state = formData.get("state") as string | null;

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Email and password are required." };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  // If OAuth flow, redirect back to the product with auth code
  if (clientId && redirectUri && data.session) {
    const callbackUrl = new URL(redirectUri);
    callbackUrl.searchParams.set("code", data.session.access_token);
    if (state) {
      callbackUrl.searchParams.set("state", state);
    }
    
    redirect(callbackUrl.toString());
  }

  // Normal login flow
  revalidatePath(redirectTo);
  redirect(redirectTo);
}

