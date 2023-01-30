import type { SupportedMIMEType, SupportedExt } from "../../constants/supportedFormats";
import { supportedFormats } from "../../constants/supportedFormats";
import { isString } from "../zod/isType";
import { parse } from "path";

/**
 * @function isASupportedImage
 * @description check if a extension or mime has support for other functions of sakfuncs lib
 * 
 * @param {String} extOrMIMEType 
 * @returns {Boolean}
 */
export function isASupportedImage(extOrMIMEType: SupportedMIMEType | SupportedExt): boolean {
  if(!isString(extOrMIMEType)) {
    throw new Error("isNotString");
  }

  try {
    const { ext } = parse(extOrMIMEType);

    if(checkByExt(ext.slice(1))) {
      return true;
    } else if(checkByExt(extOrMIMEType.slice(1))) {
      return true;
    } else if(checkByExt(extOrMIMEType) || checkByMIME(extOrMIMEType)) {
      return true;
    }
    return false;
  
    function checkByExt(extOrMIMETypeToCheck: string): boolean {
      return Object.keys(supportedFormats).includes(extOrMIMETypeToCheck.toLowerCase() as SupportedExt);
    }
    function checkByMIME(extOrMIMETypeToCheck: string): boolean {
      return Object.values(supportedFormats).includes(extOrMIMETypeToCheck.toLowerCase() as SupportedMIMEType);
    }
  } catch(error) {
    throw new Error("unexpectedError");
  }
}