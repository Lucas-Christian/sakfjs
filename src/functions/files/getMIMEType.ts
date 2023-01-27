import { instanceOfString } from "../zod/instanceof";
import { mimeTypesByExt } from "../../constants/mimetypesByExt";
import { parse } from "path";

/**
 * @function getMIMEType
 * @description get the mimeType using the filename or the path 
 * 
 * @param {String} filenameOrPath
 * @returns {String} mimeType
 */
export function getMIMEType(filenameOrPath: string): typeof mimeTypesByExt[keyof typeof mimeTypesByExt] {
  if(!instanceOfString(filenameOrPath) || filenameOrPath === "") {
    throw new Error("Path is not a string or is an empty string.");
  }

  const { ext } = parse(filenameOrPath);

  if(!instanceOfString(ext) || ext === "") {
    throw new Error("Extension is an empty string.");
  }

  const mimeType = mimeTypesByExt[ext.toLowerCase() as keyof typeof mimeTypesByExt];
  if(!mimeType) throw new Error("mimeType not founded or not exists.");

  return mimeType;
}