export type ImageType = { buffer: Buffer | Uint8Array; width: number; height: number; };
export type RGBPixel = { red: number; green: number; blue: number; };

export abstract class Base {
  protected byteOut = new Array();
  
  protected byteNew = 0;
  protected bytePos = 7;
  
  protected YTable = new Array(64);
  protected UVTable = new Array(64);
  protected fdtbl_Y = new Array(64); 
  protected fdtbl_UV = new Array(64);
  protected RGB_YUV_TABLE = new Array(2048);
  protected bitcode = new Array(65535);
  protected category = new Array(65535);

  protected YDC_HT;
  protected UVDC_HT; 
  protected YAC_HT;
  protected UVAC_HT;

  protected writeWord(word) {
    this.writeByte((word >> 8) & 0xFF);
    this.writeByte((word) & 0xFF);
  }
  protected writeBits(bits: number[]) {
    let value = bits[0];
    let posValue = bits[1]-1;
    while(posValue >= 0) {
      if(value & (1 << posValue)) {
        this.byteNew |= (1 << this.bytePos);
      }
      posValue--;
      this.bytePos--;
      if(this.bytePos < 0) {
        if(this.byteNew === 0xFF) {
          this.writeByte(0xFF);
          this.writeByte(0);
        }
        else {
          this.writeByte(this.byteNew);
        }
        this.bytePos=7;
        this.byteNew=0;
      }
    }
  }
  protected writeByte(byte: number) {
    this.byteOut.push(byte);
  }
}