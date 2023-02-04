import { START_OF_IMAGE, END_OF_IMAGE } from "./constants/headers";
import { 
  std_dc_luminance_nrcodes, std_dc_luminance_values, 
  std_ac_luminance_nrcodes, std_ac_luminance_values 
} from "./constants/luminance";
import { 
  std_dc_chrominance_nrcodes, std_dc_chrominance_values,
  std_ac_chrominance_nrcodes, std_ac_chrominance_values
} from "./constants/chrominance";
import { computeHuffmanTbl } from "./functions/computeHuffmanTbl";
import { calculateDCT } from "./functions/calculateDCT";
import { isUndefined } from "../../../resources/typeChecking/isUndefined";
import { isBuffer } from "../../../resources/typeChecking/isBuffer";
import { isNumber } from "../../../resources/typeChecking/isNumber";
import { isObject } from "../../../resources/typeChecking/isObject";
import { ZigZag } from "./constants/zigzag";
import { UVQT } from "./constants/uvqt";
import { YQT } from "./constants/yqt";

type ImageType = { buffer: Buffer, width: number, height: number };

export class JPEGEncoder {
  #byteOut = new Array();
  #byteNew = 0;
  #bytePos = 7;
  
  #YTable = new Array(64);
  #UVTable = new Array(64);
  #fdtbl_Y = new Array(64); 
  #fdtbl_UV = new Array(64);
  #RGB_YUV_TABLE = new Array(2048);
  #bitcode = new Array(65535);
  #category = new Array(65535);

  #YDC_HT;
  #UVDC_HT; 
  #YAC_HT;
  #UVAC_HT;


  constructor() {
    this.initHuffmanTbl();
    this.initCategoryNumber();
    this.initRGBYUVTable();
  }
  private initHuffmanTbl() {
    this.#YDC_HT = computeHuffmanTbl(std_dc_luminance_nrcodes, std_dc_luminance_values);
    this.#UVDC_HT = computeHuffmanTbl(std_dc_chrominance_nrcodes, std_dc_chrominance_values);
    this.#YAC_HT = computeHuffmanTbl(std_ac_luminance_nrcodes, std_ac_luminance_values);
    this.#UVAC_HT = computeHuffmanTbl(std_ac_chrominance_nrcodes, std_ac_chrominance_values);
  }
  private initCategoryNumber() {
    let nrlower = 1;
    let nrupper = 2;
    for(let cat = 1;cat <= 15;cat++) {
      //Positive numbers
      for(let nr = nrlower;nr < nrupper;nr++) {
        this.#category[32767+nr] = cat;
        this.#bitcode[32767+nr] = [];
        this.#bitcode[32767+nr][1] = cat;
        this.#bitcode[32767+nr][0] = nr;
      }

      //Negative numbers
      for(let nrneg =-(nrupper-1);nrneg <= -nrlower;nrneg++) {
        this.#category[32767+nrneg] = cat;
        this.#bitcode[32767+nrneg] = [];
        this.#bitcode[32767+nrneg][1] = cat;
        this.#bitcode[32767+nrneg][0] = nrupper-1+nrneg;
      }
      nrlower <<= 1;
      nrupper <<= 1;
    }
  }
  private initRGBYUVTable() {
    for(let i = 0; i < 256;i++) {
      this.#RGB_YUV_TABLE[i] =  19595 * i;
      this.#RGB_YUV_TABLE[(i+ 256)>>0] =  38470 * i;
      this.#RGB_YUV_TABLE[(i+ 512)>>0] =   7471 * i + 0x8000;
      this.#RGB_YUV_TABLE[(i+ 768)>>0] = -11059 * i;
      this.#RGB_YUV_TABLE[(i+1024)>>0] = -21709 * i;
      this.#RGB_YUV_TABLE[(i+1280)>>0] =  32768 * i + 0x807FFF;
      this.#RGB_YUV_TABLE[(i+1536)>>0] = -27439 * i;
      this.#RGB_YUV_TABLE[(i+1792)>>0] = - 5329 * i;
    }
  }

  public encode(image: ImageType, quality: number = 50) {
    if(!isNumber(quality)) throw new Error("invalidQuality");
    else if(quality <= 0 || quality > 100) throw new Error("invalidQuality");
    else if(!isObject(image)) throw new Error("invalidImage");
    let { width, height, buffer } = image;
  
    this.setQuality(quality);

    if(!isBuffer(buffer)) throw new Error("invalidImageBuffer");
    else if(!isNumber(width) || !isNumber(height)) throw new Error("widthOrHeightIsNotNumber");
    else if(width < 8 || width > 10000) throw new Error("widthInvalidQuantity");
    else if(height < 8 || height > 10000) throw new Error("HeightInvalidQuantity");

    this.writeWord(START_OF_IMAGE);
    this.writeJPEGHeaders(image);
    this.writeImageData(image);
    this.writeWord(END_OF_IMAGE);

    if(isUndefined(module as any)) return new Uint8Array(this.#byteOut);
    return Buffer.from(this.#byteOut);
  }
  
  private setQuality(quality: number) {
    let sf = 0;
		if(quality < 50) {
			sf = Math.floor(5000 / quality);
		} else {
			sf = Math.floor(200 - quality*2);
		}
		this.initQuantTables(sf);
  }
  private initQuantTables(sf) {
    
    for(let i = 0; i < 64; i++) {
      let t = Math.floor((YQT[i]*sf+50)/100);
      if (t < 1) {
        t = 1;
      } else if (t > 255) {
        t = 255;
      }
      this.#YTable[ZigZag[i]] = t;
    }

    for(let j = 0; j < 64; j++) {
      let u = Math.floor((UVQT[j]*sf+50)/100);
      if (u < 1) {
        u = 1;
      } else if (u > 255) {
        u = 255;
      }
      this.#UVTable[ZigZag[j]] = u;
    }
    let aasf = [
      1.0, 1.387039845, 1.306562965, 1.175875602,
      1.0, 0.785694958, 0.541196100, 0.275899379
    ];
    let k = 0;
    for(let row = 0; row < 8; row++) {
      for(let col = 0; col < 8; col++) {
        this.#fdtbl_Y[k]  = (1.0 / (this.#YTable [ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
        this.#fdtbl_UV[k] = (1.0 / (this.#UVTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
        k++;
      }
    }
  }

  private writeWord(word) {
    this.writeByte((word >> 8) & 0xFF);
    this.writeByte((word) & 0xFF);
  }

  /**
   * @function writeJPEGHeaders
   * @description thisFunction write the headers of a 
   * [JPEG](https://raw.githubusercontent.com/LordLuch/images/main/ImageCompression/JPEG/jpeg.png)
   * 
  */
  private writeJPEGHeaders({ width, height }: ImageType) {
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
      this.writeByte(this.#YTable[i]);
    }
    this.writeByte(1);
    for(let j = 0; j < 64; j++) {
      this.writeByte(this.#UVTable[j]);
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

  private writeImageData({ buffer, width, height }: ImageType) {
    // Encode 8x8 macroblocks
    let DCY = 0, DCU = 0, DCV = 0;
    
    this.#byteNew=0;
    this.#bytePos=7;

    let quadWidth = width*4;
    
    let x, y = 0;
    let red, green, blue;
    let start, p, col, row;

    let YDU = new Array(64), UDU = new Array(64), VDU = new Array(64);

    while(y < height){
      x = 0;
      while(x < quadWidth){
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
          
          red = buffer[p++];
          green = buffer[p++];
          blue = buffer[p++];
          
          // use lookup table (slightly faster)
          YDU[pos] = this.calculateYDU(red, green, blue);
          UDU[pos] = this.calculateUDU(red, green, blue);
          VDU[pos] = this.calculateVDU(red, green, blue);
        }
        
        DCY = this.processDU(YDU, this.#fdtbl_Y, DCY, this.#YDC_HT, this.#YAC_HT);
        DCU = this.processDU(UDU, this.#fdtbl_UV, DCU, this.#UVDC_HT, this.#UVAC_HT);
        DCV = this.processDU(VDU, this.#fdtbl_UV, DCV, this.#UVDC_HT, this.#UVAC_HT);
        x+=32;
      }
      y+=8;
    }
    
    this.alignMarkerBitsEndOfImage();
  }
  private calculateYDU(red, green, blue) {
    let r = this.#RGB_YUV_TABLE[red],
    g = this.#RGB_YUV_TABLE[(green +  256) >> 0],
    b = this.#RGB_YUV_TABLE[(blue +  512) >> 0];

    return ((r + g + b) >> 16) - 128;
  }
  private calculateUDU(red, green, blue) {
    let r = this.#RGB_YUV_TABLE[(red +  768) >> 0],
    g = this.#RGB_YUV_TABLE[(green + 1024) >> 0], 
    b = this.#RGB_YUV_TABLE[(blue + 1280) >> 0];

    return ((r + g + b) >> 16) - 128;
  }
  private calculateVDU(red, green, blue) {
    let r = this.#RGB_YUV_TABLE[(red + 1280) >> 0], 
    g = this.#RGB_YUV_TABLE[(green + 1536) >> 0], 
    b = this.#RGB_YUV_TABLE[(blue + 1792) >> 0];

    return ((r + g + b) >> 16) - 128;
  }
  private processDU(CDU, fdtbl, DC, HTDC, HTAC){
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
      this.writeBits(HTDC[this.#category[pos]]);
      this.writeBits(this.#bitcode[pos]);
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
      this.writeBits(HTAC[(nrzeroes<<4)+this.#category[pos]]);
      this.writeBits(this.#bitcode[pos]);
      i++;
    }
    if(end0pos !== 63 ) {
      this.writeBits(EOB);
    }
    return DC;
  }
  private alignMarkerBitsEndOfImage() {
    if(this.#bytePos >= 0) {
      let fillbits: number[] = [];
      fillbits[1] = this.#bytePos+1;
      fillbits[0] = (1 << (this.#bytePos+1))-1;
      this.writeBits(fillbits);
    }
  }

  private writeBits(bits: number[]) {
    let value = bits[0];
    let posValue = bits[1]-1;
    while(posValue >= 0) {
      if(value & (1 << posValue)) {
        this.#byteNew |= (1 << this.#bytePos);
      }
      posValue--;
      this.#bytePos--;
      if(this.#bytePos < 0) {
        if(this.#byteNew === 0xFF) {
          this.writeByte(0xFF);
          this.writeByte(0);
        }
        else {
          this.writeByte(this.#byteNew);
        }
        this.#bytePos=7;
        this.#byteNew=0;
      }
    }
  }
  private writeByte(byte: number) {
    this.#byteOut.push(byte);
  }
}