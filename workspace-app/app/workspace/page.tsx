import Link from "next/link";
import { requireUser } from "@/lib/supabase/server";
import { signOut } from "./actions";

export default async function WorkspacePage() {
  const user = await requireUser();

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold">Workspace</h1>
      <p className="text-sm">Signed in as {user.email}</p>
      <Link href="/workspace/knowledge" className="text-sm underline">
        Knowledge base →
      </Link>
      <Link href="/workspace/strategy" className="text-sm underline">
        Strategy board →
      </Link>
      <form action={signOut}>
        <button type="submit" className="border rounded px-3 py-2">
          Sign out
        </button>
      </form>
    </div>
  );
}
