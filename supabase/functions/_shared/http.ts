export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function json(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
export function methodCheck(req: Request): Response | null {
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });
  return req.method === "POST"
    ? null
    : json({ error: "Method not allowed." }, 405);
}
export async function boundedText(req: Request, max = 65536): Promise<string> {
  if (Number(req.headers.get("content-length")) > max)
    throw new HttpError(413, "Request is too large.");
  const reader = req.body?.getReader();
  if (!reader) throw new HttpError(400, "Missing request body.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > max) {
      await reader.cancel();
      throw new HttpError(413, "Request is too large.");
    }
    chunks.push(value);
  }
  const result = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(result);
}
export async function readJson(req: Request): Promise<any> {
  const raw = await boundedText(req);
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new Error();
    return value;
  } catch {
    throw new HttpError(400, "Invalid request body.");
  }
}
export function failure(error: unknown): Response {
  if (error instanceof HttpError)
    return json({ error: error.message }, error.status);
  console.error(
    "Request failed:",
    error instanceof Error ? error.message : "Unknown error",
  );
  return json(
    {
      error:
        "Service temporarily unavailable. Please keep your reference and try again.",
    },
    503,
  );
}
export function textField(
  value: unknown,
  name: string,
  max = 200,
  required = true,
): string {
  if (value === null || value === undefined || value === "") {
    if (!required) return "";
    throw new HttpError(400, `${name} is required.`);
  }
  if (
    typeof value !== "string" ||
    value.trim().length === 0 ||
    value.length > max
  )
    throw new HttpError(400, `Invalid ${name}.`);
  return value.trim();
}
export function quantity(value: unknown): number {
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value < 1 ||
    value > 10000
  )
    throw new HttpError(
      400,
      "Quantity must be a whole number between 1 and 10,000.",
    );
  return value;
}
export const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
