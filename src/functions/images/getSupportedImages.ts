import type { SupportedMIMEType } from "../../types/SupportedMIMEType";
import type { SupportedExt } from "../../types/SupportedExt";
import type { Image } from "../../types/Image";
import type { Stats } from "fs";
import { isASupportedImage } from "./isASupportedImage";
import { join, parse } from "path";
import { readdirSync } from "fs";
import { getMIMEType } from "../files/getMIMEType";
import { isUndefined } from "../zod/directType";
import { getStat } from "../fs/getStat";
import { z } from "zod";
import { supportedFormats } from "../../constants/supportedFormats";

/**
 * @function getSupportedImages
 * @description get the images that other functions of sakfuncs lib support
 * 
 * @param folderPath 
 * @returns {Promise<Image[]>}
*/

const extSchema = z.enum(Object.keys(supportedFormats)),
mimeSchema = z.enum(Object.values(supportedFormats));


const Image = z.object({
  name: z.string(),
  size: z.number(),
  path: z.string(),
  ext: extSchema,
  mime: mimeSchema
});


export async function getSupportedImages(folderPath: string): Promise<Image[]> {
  try {
    let images: Image[] = [];
    
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