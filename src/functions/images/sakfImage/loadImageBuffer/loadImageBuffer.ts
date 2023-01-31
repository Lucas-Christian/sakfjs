import { readSomeFile } from "../../../fs/readSomeFile";
import { loadFromURL } from "./loadFromURL/loadFromURL";
import { isString } from "../../../zod/isString";

export async function loadImageBuffer(src) {
  if(!isString(src)) {
    throw new Error("isNotString");
  }
  if(!src.match(/^(http|ftp)s?:\/\/./)) {
    return await readSomeFile(src);
  }
  return await loadFromURL(src);
}