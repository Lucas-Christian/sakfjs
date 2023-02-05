type Options = {
  colorTransform: undefined;
  useTArray: boolean;
  formatAsRGBA: boolean;
  tolerantDecoding: boolean;
  maxResolutionInMP: number;
  maxMemoryUsageInMB: number;
};
export type JFIF = { 
  version: { major: any; minor: any; }; 
  densityUnits: any;
  xDensity: number; yDensity: number; 
  thumbWidth: any; thumbHeight: any; 
  thumbData: any; 
};
export type Adobe = { version: any; flags0: number; flags1: number; transformCode: any; };

export class Base {
  protected width: number;
  protected height: number;
  protected options: Options;
  protected totalBytesAllocated;
  protected maxMemoryUsageBytes;
  protected comments;
  protected exifBuffer;
  protected jfif: JFIF;
  protected adobe: Adobe;
  protected components;

}