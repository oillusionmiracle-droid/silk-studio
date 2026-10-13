// Validate file signatures, never rely on browser-supplied MIME types.
export function detectReferenceFormat(bytes: Uint8Array): string | null {
  const starts = (...values: number[]) =>
    values.every((v, i) => bytes[i] === v);
  const prefix = new TextDecoder().decode(bytes.slice(0, 40));
  if (starts(0xff, 0xd8, 0xff)) return "jpg";
  if (starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "png";
  if (prefix.startsWith("RIFF") && prefix.slice(8, 12) === "WEBP")
    return "webp";
  if (prefix.startsWith("%PDF-")) return "pdf";
  if (prefix.startsWith("8BPS") && bytes[4] === 0 && [1, 2].includes(bytes[5]))
    return "psd";
  if (prefix.startsWith("%!PS-Adobe-")) return "eps";
  return null;
}
