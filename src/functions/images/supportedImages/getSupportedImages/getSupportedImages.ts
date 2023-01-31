import type { SupportedExt, SupportedMIMEType } from "../../../../constants/supportedFormats";
import type { Stats } from "fs";
import { isASupportedImage } from "../isASupportedImage/isASupportedImage";
import { join, parse } from "path";
import { readdirSync } from "fs";
import { getMIMEType } from "../../../files/getMIMEType";
import { isUndefined } from "../../../zod/isUndefined";
import { isString } from "../../../zod/isString";
import { getStat } from "../../../fs/getStat";
import { z } from "zod";

const ImageSchema = z.object({
  name: z.string(),
  size: z.number(),
  path: z.string(),
  ext: z.string().array().element,
  mime: z.string().array().element
});
type Image = z.TypeOf<typeof ImageSchema>;

/**
 * @function getSupportedImages
 * @description get the images that other functions of sakfjs funcs lib support
 * 
 * @param folderPath 
 * @returns {Promise<Image[]>}
*/
export async function getSupportedImages(folderPath: string): Promise<Image[]> {
  let images: Image[] = [];
  
  if(isUndefined(folderPath as any)) {
    throw new Error("undefinedFolderPath");
  } else if(!isString(folderPath) || folderPath === "") {
    throw new Error("folderPathEmptyOrIsNotString");
  }
  
  const folder = readdirSync(folderPath);
  if(folder.length === 0) {
    throw new Error("emptyFolder");
  }
  
  for(let file in folder) {
    let pathToFile = join(folderPath, folder[file]),
    fileStat = await getStat(pathToFile) as Stats;

    if(!fileStat.isFile()) continue;
    let { ext, name } = parse(pathToFile),
    MIMEType = getMIMEType(pathToFile);

    if(!isASupportedImage(ext as SupportedExt)) continue;
    images.push(
      ImageSchema.parse({ 
        name: name, 
        size: fileStat.size, 
        path: pathToFile,
        ext: ext as SupportedExt,
        mime: MIMEType as SupportedMIMEType
      })
    );
  }
  
  if(images.length === 0) {
    throw new Error("dontHasSupportedImages");
  }

  images.sort((prev, next) => prev.name!.length - next.name!.length);
  return images;
}