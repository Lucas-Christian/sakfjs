import { mimeTypesByExt } from "../../../constants/mimetypesByExt";
import { isString } from "../../typeChecking/isString";
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

  if(getMIME(filenameOrPath)) {
    return getMIME(filenameOrPath);
  } else if(getMIME(`.${filenameOrPath}`)) {
    return getMIME(`.${filenameOrPath}`);
  }

  const { ext } = parse(filenameOrPath);
  if(!isString(ext) || ext === "") {
    throw new Error("extensionNotFound");
  }

  return getMIME(ext);
  
  function getMIME(MIMEToSearch: string) {
    return mimeTypesByExt[MIMEToSearch.toLowerCase() as keyof typeof mimeTypesByExt];
  }
}