import type { supportedFormats } from "../constants/supportedFormats";

export type SupportedMIMEType = typeof supportedFormats[keyof typeof supportedFormats];
