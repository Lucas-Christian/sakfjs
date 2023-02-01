import { promisifyReadFile } from "../../native/promisifyReadFile";
import { loadFromURL } from "./loadFromURL";
import { isString } from "../../typeChecking/isString";

export async function loadImageBuffer(src) {
  if(!isString(src)) {
    throw new Error("isNotString");
  }
  if(!src.match(/^(http|ftp)s?:\/\/./)) {
    return await promisifyReadFile(src);
  }
  return await loadFromURL(src);
}