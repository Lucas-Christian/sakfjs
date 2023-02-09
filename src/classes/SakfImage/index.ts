import { getImageBuffer } from "../../resources/native/getImageBuffer/index";
import { ImageResizer } from "../ImageResizer/index";
import { isString } from "../../resources/typeChecking/isString/index";
import { Base } from "./Base";
import { JPEG } from "../JPEG/index";
import { PNG } from "../PNG/index";

export class SakfImage extends Base {
  constructor(imagePath: string) {
    super();
    this.updateData(imagePath);
  }
  public updateData(imagePath: string) {
    this.path = imagePath;
    this.mime = this.path;
    this.loadBuffer();
  }
  public quality(quality: number) {
    const qualityChangers = {
      "image/jpeg": () => {
        let jpeg = new JPEG();
        let image = jpeg.decode(this.buffer);
        let changedImageQuality = jpeg.encode(image, quality);
        
        return changedImageQuality;
      },
      "image/png": () => {
        let png = new PNG();
        let image = png.decode(this.buffer);
        let changedImageQuality = png.encode(image, quality);

        return changedImageQuality;
      }
    }
    let qualityChanger = qualityChangers[this.mime as keyof typeof qualityChangers];
    return qualityChanger();
  }
  public resize(width: number, height: number) {
    let resizer = new ImageResizer(this.path),
    resizedImage = resizer.resize(width, height);

    return resizedImage;
  }
  public changeExtension(_extension: string) {

  }
  public async loadBuffer() {
    if(!isString(this.path)) throw new Error("imagePathIsNotSstring");
    this.buffer = await getImageBuffer(this.path);
  }
  public deleteBuffer() {
    this.buffer = undefined as any;
  }
}