import { MIME_JPEG, MIME_PNG } from "jimp";
import { z } from "zod";

const supportedFormatsSchema = z.object({
  jpg: z.string(),
  png: z.string()
});

export const supportedFormats = supportedFormatsSchema.parse({
  "jpg": MIME_JPEG,
  "png": MIME_PNG
});

export type SupportedExt = keyof typeof supportedFormats;
export type SupportedMIMEType = typeof supportedFormats[keyof typeof supportedFormats];