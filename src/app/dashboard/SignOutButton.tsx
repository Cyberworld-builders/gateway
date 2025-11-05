'use client';

import { useFormStatus } from "react-dom";

import { signOutAction } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="border border-[#00ff00]/50 bg-[#1a1a1a] px-4 py-2 text-sm font-mono uppercase text-[#00ff00] transition hover:bg-[#00ff00] hover:text-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "[ signing out... ]" : "[ sign out ]"}
    </button>
  );
}

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <SubmitButton />
    </form>
  );
}
