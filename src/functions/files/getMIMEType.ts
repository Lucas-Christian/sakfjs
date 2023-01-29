import { isString } from "../zod/isType";
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
  if(!isString(filenameOrPath) || filenameOrPath === "") {
    throw new Error("filenameOrPathEmptyOrIsNotString");
  }

  const { ext } = parse(filenameOrPath);

  if(!isString(ext) || ext === "") {
    throw new Error("extensionNotFound");
  }

  const mimeType = mimeTypesByExt[ext.toLowerCase() as keyof typeof mimeTypesByExt];
  if(!mimeType) throw new Error("MIMETypeNotFound");

  return mimeType;
}