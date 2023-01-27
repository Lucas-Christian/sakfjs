import type { SupportedMIMEType } from "../types/SupportedMIMEType";
import type { SupportedExt } from "../types/SupportedExt";

export interface Result {
  folderPath: string;
  images: Image[];
}
interface Image {
  name?: string;
  size?: number;
  path?: string;
  ext?: SupportedExt;
  mime?: SupportedMIMEType;

  context?: "emptyFolder" | "dontHasSupportedImages" | "returnToDefault";
}