import type { ImageType, RGBPixel } from "../Base";
import { 
  std_dc_luminance_nrcodes, std_dc_luminance_values, 
  std_ac_luminance_nrcodes, std_ac_luminance_values 
} from "../constants/luminance";
import { 
  std_dc_chrominance_nrcodes, std_dc_chrominance_values,
  std_ac_chrominance_nrcodes, std_ac_chrominance_values
} from "../constants/chrominance";
import { calculateDCT } from "./functions/calculateDCT";
import { calculateYDU } from "./functions/calculateYDU";
import { calculateUDU } from "./functions/calculateUDU";
import { calculateVDU } from "./functions/calculateVDU";
import { ZigZag } from "../constants/zigzag";
import { Init } from "../Init";

export class Algorithm extends Init {
  constructor() {
    super();
  }

  protected writeJPEGHeaders({ width, height }: ImageType) {
    this.writeApplication0();
    this.writeDefineQuantizationTable();
    this.writeStartOfFrame(width, height);
    this.writeDefineHuffmanTable();
    this.writeStartOfScan();
  }
  private writeApplication0() {
    this.writeWord(0xFFE0); // Marker
    this.writeWord(16); // Length
    this.writeByte(0x4A); // J
    this.writeByte(0x46); // F
    this.writeByte(0x49); // I
    this.writeByte(0x46); // F
    this.writeByte(0); // \0
    this.writeByte(1); // versionhi
    this.writeByte(1); // versionlo
    this.writeByte(0); // xyunits
    this.writeWord(1); // xdensity
    this.writeWord(1); // ydensity
    this.writeByte(0); // thumbnwidth
    this.writeByte(0); // thumbnheight
  }
  private writeDefineQuantizationTable() {
    this.writeWord(0xFFDB); // marker
    this.writeWord(132); // length
    this.writeByte(0);
    for(let i = 0; i < 64;i++) {
      this.writeByte(this.YTable[i]);
    }
    this.writeByte(1);
    for(let j = 0; j < 64; j++) {
      this.writeByte(this.UVTable[j]);
    }
  }
  private writeStartOfFrame(width: ImageType["width"], height: ImageType["height"]) {
    this.writeWord(0xFFC0); // marker
    this.writeWord(17); // length, truecolor YUV JPG
    this.writeByte(8); // precision
    this.writeWord(height);
    this.writeWord(width);
    this.writeByte(3); // nrofcomponents
    this.writeByte(1); // IdY
    this.writeByte(0x11); // HVY
    this.writeByte(0); // QTY
    this.writeByte(2); // IdU
    this.writeByte(0x11); // HVU
    this.writeByte(1); // QTU
    this.writeByte(3); // IdV
    this.writeByte(0x11); // HVV
    this.writeByte(1); // QTV
  }
  private writeDefineHuffmanTable() {
    this.writeWord(0xFFC4); // marker
    this.writeWord(0x01A2); // length

    this.writeByte(0); // HTYDCinfo
    for(let i = 0; i < 16;i++) {
      this.writeByte(std_dc_luminance_nrcodes[i+1]);
    }
    for(let j = 0; j <= 11;j++) {
      this.writeByte(std_dc_luminance_values[j]);
    }

    this.writeByte(0x10); // HTYACinfo
    for(let k = 0; k < 16;k++) {
      this.writeByte(std_ac_luminance_nrcodes[k+1]);
    }
    for(let l = 0; l <= 161;l++) {
      this.writeByte(std_ac_luminance_values[l]);
    }

    this.writeByte(1); // HTUDCinfo
    for(let m = 0;m < 16;m++) {
      this.writeByte(std_dc_chrominance_nrcodes[m+1]);
    }
    for(let n = 0;n <= 11;n++) {
      this.writeByte(std_dc_chrominance_values[n]);
    }

    this.writeByte(0x11); // HTUACinfo
    for(let o = 0;o < 16;o++) {
      this.writeByte(std_ac_chrominance_nrcodes[o+1]);
    }
    for(let p = 0;p <= 161;p++) {
      this.writeByte(std_ac_chrominance_values[p]);
    }
  }
  private writeStartOfScan() {
    this.writeWord(0xFFDA); // marker
    this.writeWord(12); // length
    this.writeByte(3); // nrofcomponents
    this.writeByte(1); // IdY
    this.writeByte(0); // HTY
    this.writeByte(2); // IdU
    this.writeByte(0x11); // HTU
    this.writeByte(3); // IdV
    this.writeByte(0x11); // HTV
    this.writeByte(0); // Ss
    this.writeByte(0x3f); // Se
    this.writeByte(0); // Bf
  }

  protected writeImageData({ buffer, width, height }: ImageType) {
    // Encode 8x8 macroblocks
    let DCY = 0, DCU = 0, DCV = 0;
    
    this.byteNew=0;
    this.bytePos=7;

    let quadWidth = width*4;
    
    let x, y = 0;
    let start, p, col, row;

    let YDU = new Array(64), UDU = new Array(64), VDU = new Array(64);

    while(y < height) {
      x = 0;
      while(x < quadWidth) {
        start = quadWidth * y + x;
        p = start;
        col = -1;
        row = 0;
        
        for(let pos = 0;pos < 64;pos++) {
          row = pos >> 3;// /8
          col = ( pos & 7 ) * 4; // %8
          p = start + ( row * quadWidth ) + col;		
          
          if(y+row >= height) { // padding bottom
            p-= (quadWidth*(y+1+row-height));
          }

          if(x+col >= quadWidth) { // padding right	
            p-= ((x + col) - quadWidth + 4);
          }

          let image = {
            red: buffer[p++],
            green: buffer[p++],
            blue: buffer[p++]
          } as RGBPixel;
          
          
          // use lookup table (slightly faster)
          YDU[pos] = calculateYDU(this.RGB_YUV_TABLE, image);
          UDU[pos] = calculateUDU(this.RGB_YUV_TABLE, image);
          VDU[pos] = calculateVDU(this.RGB_YUV_TABLE, image);
        }
        
        DCY = this.processDU(YDU, this.fdtbl_Y, DCY, this.YDC_HT, this.YAC_HT);
        DCU = this.processDU(UDU, this.fdtbl_UV, DCU, this.UVDC_HT, this.UVAC_HT);
        DCV = this.processDU(VDU, this.fdtbl_UV, DCV, this.UVDC_HT, this.UVAC_HT);
        x+=32;
      }
      y+=8;
    }
    
    this.alignMarkerBitsEndOfImage();
  }
  private alignMarkerBitsEndOfImage() {
    if(this.bytePos >= 0) {
      let fillbits: number[] = [];
      fillbits[1] = this.bytePos+1;
      fillbits[0] = (1 << (this.bytePos+1))-1;
      this.writeBits(fillbits);
    }
  }

  private processDU(CDU: any, fdtbl: any, DC: any, HTDC: any, HTAC: any) {
    let DU = new Array(64);

    let EOB = HTAC[0x00];
    let M16zeroes = HTAC[0xF0];
    let pos;
  
    let DU_DCT = calculateDCT(CDU, fdtbl);
  
    //ZigZag reorder
    for(let j=0;j < 64;++j) {
      DU[ZigZag[j]] = DU_DCT[j];
    }
    let Diff = DU[0] - DC; DC = DU[0];
    //Encode DC
    if(Diff === 0) {
      this.writeBits(HTDC[0]); // Diff might be 0
    } else {
      pos = 32767+Diff;
      this.writeBits(HTDC[this.category[pos]]);
      this.writeBits(this.bitcode[pos]);
    }
    
    //Encode ACs
    let end0pos = 63; //end0pos = first element in reverse order !=0
    for(; (end0pos>0) && (DU[end0pos] === 0); end0pos--) {};
  
    if(end0pos === 0) {
      this.writeBits(EOB);
      return DC;
    }
    let i = 1;
    let lng;
    while(i <= end0pos) {
      let startpos = i;
      for(;(DU[i] === 0) && (i <= end0pos); ++i) {}
      let nrzeroes = i-startpos;
      if( nrzeroes >= 16 ) {
        lng = nrzeroes>>4;
        for (let nrmarker=1; nrmarker <= lng; ++nrmarker)
          this.writeBits(M16zeroes);
        nrzeroes = nrzeroes&0xF;
      }
      pos = 32767+DU[i];
      this.writeBits(HTAC[(nrzeroes<<4)+this.category[pos]]);
      this.writeBits(this.bitcode[pos]);
      i++;
    }
    if(end0pos !== 63 ) {
      this.writeBits(EOB);
    }
    return DC;
  }
}