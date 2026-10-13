export const runtime = "nodejs";
import { v2 as cloudinary } from "cloudinary";
import { authenticatedUser, getServerSupabase } from "@/lib/serverSupabase";
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const user = await authenticatedUser(req);
    if (!user)
      return Response.json(
        { error: "Sign in to download files." },
        { status: 401 },
      );
    const supabase = getServerSupabase();
    const { data: file, error } = await supabase
      .from("reference_assets")
      .select("*")
      .eq("id", params.id)
      .maybeSingle();
    if (error) throw error;
    if (!file)
      return Response.json({ error: "File unavailable." }, { status: 404 });
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (file.user_id !== user.id && profile?.role !== "admin")
      return Response.json({ error: "File unavailable." }, { status: 404 });
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const url = cloudinary.utils.private_download_url(
      file.public_id,
      file.format,
      {
        resource_type: file.resource_type,
        type: "authenticated",
        expires_at: Math.floor(Date.now() / 1000) + 60,
        attachment: true,
      },
    );
    return Response.json({ url }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      { error: "Download temporarily unavailable." },
      { status: 503 },
    );
  }
}
