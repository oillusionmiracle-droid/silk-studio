export const runtime = "nodejs";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { authenticatedUser, getServerSupabase } from "@/lib/serverSupabase";
import {
  checkDistributedRateLimit,
  rateLimitedResponse,
} from "@/lib/rateLimit";
import { detectReferenceFormat } from "@/lib/uploadValidation";
const MAX_FILE_SIZE = 3 * 1024 * 1024; // Fits Vercel's request-body limit, including multipart overhead.
function configureCloudinary() {
  if (
    !process.env.CLOUDINARY_API_SECRET ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  )
    throw new Error("Upload configuration missing.");
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}
export async function POST(req: Request) {
  try {
    const user = await authenticatedUser(req);
    if (!user)
      return Response.json(
        { error: "Sign in to upload files." },
        { status: 401 },
      );
    const rl = await checkDistributedRateLimit(
      `upload:${user.id}`,
      10,
      3600000,
    );
    if (!rl.allowed) return rateLimitedResponse(rl.retryAfterSeconds);
    if (Number(req.headers.get("content-length")) > MAX_FILE_SIZE + 65536)
      return Response.json(
        { error: "File must be 3MB or smaller." },
        { status: 413 },
      );
    const file = (await req.formData()).get("file");
    if (!(file instanceof Blob) || !file.size || file.size > MAX_FILE_SIZE)
      return Response.json(
        { error: "File must be 3MB or smaller." },
        { status: 400 },
      );
    const buffer = Buffer.from(await file.arrayBuffer());
    const format = detectReferenceFormat(buffer);
    if (!format)
      return Response.json(
        { error: "Upload a valid JPG, PNG, WEBP, PDF, PSD, or EPS file." },
        { status: 400 },
      );
    configureCloudinary();
    const id = crypto.randomUUID();
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `order-references/${user.id}`,
            public_id: ["jpg", "png", "webp"].includes(format)
              ? id
              : `${id}.${format}`,
            resource_type: ["jpg", "png", "webp"].includes(format)
              ? "image"
              : "raw",
            type: "authenticated",
            overwrite: false,
          },
          (error, uploaded) =>
            error || !uploaded
              ? reject(error || new Error("Upload failed"))
              : resolve(uploaded),
        )
        .end(buffer);
    });
    const { error } = await getServerSupabase()
      .from("reference_assets")
      .insert({
        id,
        user_id: user.id,
        public_id: result.public_id,
        resource_type: result.resource_type,
        format: result.format || format,
        original_name: (file instanceof File
          ? file.name
          : `reference.${format}`
        ).slice(0, 200),
      });
    if (error) {
      await cloudinary.uploader.destroy(result.public_id, {
        resource_type: result.resource_type,
        type: "authenticated",
      });
      throw new Error("Upload could not be recorded.");
    }
    return Response.json({ secure_url: `/api/reference-files/${id}` });
  } catch (error) {
    console.error(
      "Reference upload failed:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return Response.json(
      { error: "Upload temporarily unavailable. Please try again." },
      { status: 503 },
    );
  }
}
