import { instanceOfString } from "../zod/instanceof";
import { extByMIMEType } from "../../constants/extByMIMEType";

/**
 * @function getExtensions
 * @description get all Extensions of a mimeType
 * 
 * @param {String} mimeType 
 * @returns {String} extensions
 */
export function getExtensions(mimeType: string): typeof extByMIMEType[keyof typeof extByMIMEType] {
  if(!instanceOfString(mimeType) || mimeType === "") {
    throw new Error("mimeType is not a string or is an empty string.")
  }

  const extensions = extByMIMEType[mimeType.toLowerCase() as keyof typeof extByMIMEType];
  if(!extensions) throw new Error("Extension not founded or not exists.");

  return extensions;
};