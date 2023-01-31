import { extByMIMEType } from "../../constants/extByMIMEType";
import { isString } from "../zod/isString";

/**
 * @function getExtensions
 * @description get all Extensions of a mimeType
 * 
 * @param {String} MIMEType 
 * @returns {String} extensions
 */
export function getExtensions(MIMEType: string): typeof extByMIMEType[keyof typeof extByMIMEType] {
  if(!isString(MIMEType) || MIMEType === "") {
    throw new Error("MIMETypeEmptyOrIsNotString");
  }

  return extByMIMEType[MIMEType.toLowerCase() as keyof typeof extByMIMEType];
};