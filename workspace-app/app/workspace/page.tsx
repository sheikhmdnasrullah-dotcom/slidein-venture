import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export default async function WorkspacePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold">Workspace</h1>
      <p className="text-sm">Signed in as {user.email}</p>
      <form action={signOut}>
        <button type="submit" className="border rounded px-3 py-2">
          Sign out
        </button>
      </form>
    </div>
  );
}
