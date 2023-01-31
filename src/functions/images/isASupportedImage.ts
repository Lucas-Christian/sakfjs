import type { SupportedMIMEType, SupportedExt } from "../../constants/supportedFormats";
import { supportedFormats } from "../../constants/supportedFormats";
import { getMIMEType } from "../files/getMIMEType";
import { isString } from "../zod/isString";

/**
 * @function isASupportedImage
 * @description check if a extension or mime has support for other functions of sakfjs funcs lib
 * 
 * @param {String} extOrMIMEType 
 * @returns {Boolean}
 */
export function isASupportedImage(extOrMIMEType: SupportedMIMEType | SupportedExt): boolean {
  if(!isString(extOrMIMEType)) {
    throw new Error("isNotString");
  }

  if(checkByMIME(extOrMIMEType)) {
    return true;
  }

  let MIMEType = getMIMEType(extOrMIMEType);

  if(checkByMIME(MIMEType)) {
    return true;
  }
  return false;

  function checkByMIME(MIMEToCheck: string): boolean {
    return Object.values(supportedFormats).includes(MIMEToCheck.toLowerCase() as SupportedMIMEType);
  }
}