import "server-only";
import { createClient } from "@supabase/supabase-js";
export function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key)
    throw new Error("Server database configuration is missing.");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
export async function authenticatedUser(req: Request) {
  const token = /^Bearer\s+(.+)$/i.exec(
    req.headers.get("authorization") || "",
  )?.[1];
  if (!token) return null;
  const { data, error } = await getServerSupabase().auth.getUser(token);
  return error ? null : data.user;
}
