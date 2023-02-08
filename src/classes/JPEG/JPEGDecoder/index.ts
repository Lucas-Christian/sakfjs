import { Algorithm } from "./Algorithm";

export class JPEGDecoder extends Algorithm {

  public decode(jpegData, userOptions = {}) {
    let defaultOpts = {
      colorTransform: undefined,
      useTArray: false,
      formatAsRGBA: true,
      tolerantDecoding: true,
      maxResolutionInMP: 100, // Don't decode more than 100 megapixels
      maxMemoryUsageInMB: 512, // Don't decode if memory footprint is more than 512MB
    };
  
    let options = {...defaultOpts, ...userOptions};
    let arr = new Uint8Array(jpegData);
    this.options = options;

    this.resetMaxMemoryUsage(options.maxMemoryUsageInMB * 1024 * 1024);
    this.parse(arr);
  
    let channels = (options.formatAsRGBA) ? 4 : 3;
    let bytesNeeded = this.width * this.height * channels;

    let image;

    try {
      this.requestMemoryAllocation(bytesNeeded);
      image = {
        width: this.width,
        height: this.height,
        buffer: options.useTArray ?
          new Uint8Array(bytesNeeded) :
          Buffer.alloc(bytesNeeded)
      };
    } catch(err: any) {
      if(err instanceof RangeError) {
        throw new Error(`Could not allocate enough memory for the image. Required: ${bytesNeeded}`);
      } 
      
      if(err instanceof ReferenceError) {
        if(err.message === "Buffer is not defined") {
          throw new Error("Buffer is not globally defined in this environment. Consider setting useTArray to true");
        }
      }
      throw err;
    }
  
    this.copyToImageData(image, options.formatAsRGBA);
  
    return image;
  }
}