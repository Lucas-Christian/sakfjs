import { promisifyReadFile } from "../promisifyReadFile";
import { getFromURL } from "./getFromURL";
import { isString } from "../../typeChecking/isString";

export async function getImageBuffer(src: string) {
  if(!isString(src)) {
    throw new Error("isNotString");
  }
  if(!src.match(/^(http|ftp)s?:\/\/./)) {
    return await promisifyReadFile(src);
  }
  return await getFromURL(src);
}