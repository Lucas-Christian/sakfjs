import type { SupportedMIMEType } from "../../types/SupportedMIMEType";
import type { SupportedExt } from "../../types/SupportedExt";
import type { Result } from "../../interfaces/Result";
import type { Stats } from "fs";
import { isASupportedImage } from "./isASupportedImage";
import { join, parse } from "path";
import { readdirSync } from "fs";
import { getMIMEType } from "../files/getMIMEType";
import { isUndefined } from "../zod/directType";
import { getStat } from "../fs/getStat";

/**
 * @function getImages
 * @description get the images that other functions of sakfuncs lib support
 * 
 * @param folderPath 
 * @returns {Promise<[Result["images"]]>}
 */

export async function getImages(folderPath: string) {
  try {
    let images: Result["images"] = [];
    
    if(isUndefined(folderPath as any)) {
      throw new Error("undefinedFolderPath");
    }
  
    const folder = readdirSync(folderPath);
    if(folder.length === 0) {
      throw new Error("emptyFolder");
    }
  
    for(let file in folder) {
      let pathToFile = join(folderPath, folder[file]),
      fileStat = await getStat(pathToFile) as Stats;
  
      if(!fileStat.isFile()) continue;
      let { ext } = parse(pathToFile),
      MIMEType = getMIMEType(pathToFile);
  
      if(!isASupportedImage(ext as SupportedExt)) continue;
      images.push(
        { 
          name: folder[file], 
          size: fileStat.size, 
          path: pathToFile,
          ext: ext as SupportedExt,
          mime: MIMEType as SupportedMIMEType
        }
      );
    }
    if(images.length === 0) {
      throw new Error("dontHasSupportedImages");
    }
    images.sort((prev, next) => prev.name!.length - next.name!.length);
    return images;
  } catch(error) {
    throw new Error("unexpectedError");
  }
}