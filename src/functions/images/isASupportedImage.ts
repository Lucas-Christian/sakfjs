import type { SupportedMIMEType, SupportedExt } from "../../constants/supportedFormats";
import { supportedFormats } from "../../constants/supportedFormats";

export function isASupportedImage(extOrMIMEType: SupportedMIMEType | SupportedExt): boolean {
  try {
    if(checkByExt() || checkByMIME()) {
      return true;
    }
    return false;
  
    function checkByExt(): boolean {
      return Object.keys(supportedFormats).includes(extOrMIMEType.toLowerCase() as SupportedExt);
    }
    function checkByMIME(): boolean {
      return Object.values(supportedFormats).includes(extOrMIMEType.toLowerCase() as SupportedMIMEType);
    }
  } catch(error) {
    throw new Error("unexpectedError");
  }
}