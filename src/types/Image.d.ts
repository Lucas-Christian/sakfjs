import type { SupportedMIMEType } from "./SupportedMIMEType";
import type { SupportedExt } from "./SupportedExt";

export type Image = {
  name?: string;
  size?: number;
  path?: string;
  ext?: SupportedExt;
  mime?: SupportedMIMEType;
}