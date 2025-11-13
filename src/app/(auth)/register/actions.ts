'use server';

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { AuthFormState } from "../login/actions";

export async function registerAction(
  _prevState: AuthFormState | undefined,
  formData: FormData,
): Promise<AuthFormState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  
  // OAuth parameters
  const clientId = formData.get("client_id") as string | null;
  const redirectUri = formData.get("redirect_uri") as string | null;
  const state = formData.get("state") as string | null;

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Email and password are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  if (typeof confirmPassword === "string" && confirmPassword !== password) {
    return { error: "Passwords do not match." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // If OAuth flow and we have a session, redirect back to the product
  if (clientId && redirectUri && session) {
    const callbackUrl = new URL(redirectUri);
    callbackUrl.searchParams.set("code", session.access_token);
    if (state) {
      callbackUrl.searchParams.set("state", state);
    }
    
    redirect(callbackUrl.toString());
  }

  // Normal registration flow
  const destination = session ? "/dashboard" : "/login";
  revalidatePath(destination);
  redirect(destination);
}

