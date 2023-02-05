import { 
  std_dc_luminance_nrcodes, std_dc_luminance_values, 
  std_ac_luminance_nrcodes, std_ac_luminance_values 
} from "../constants/luminance";
import { 
  std_dc_chrominance_nrcodes, std_dc_chrominance_values,
  std_ac_chrominance_nrcodes, std_ac_chrominance_values
} from "../constants/chrominance";
import { computeHuffmanTbl } from "./functions/computeHuffmanTbl";
import { ZigZag } from "../constants/zigzag";
import { Base } from "../Base";
import { UVQT } from "../constants/uvqt";
import { YQT } from "../constants/yqt";

export class Init extends Base {
  constructor() {
    super();
    this.initHuffmanTbl();
    this.initCategoryNumber();
    this.initRGBYUVTable();
  }
  private initHuffmanTbl() {
    this.YDC_HT = computeHuffmanTbl(std_dc_luminance_nrcodes, std_dc_luminance_values);
    this.UVDC_HT = computeHuffmanTbl(std_dc_chrominance_nrcodes, std_dc_chrominance_values);
    this.YAC_HT = computeHuffmanTbl(std_ac_luminance_nrcodes, std_ac_luminance_values);
    this.UVAC_HT = computeHuffmanTbl(std_ac_chrominance_nrcodes, std_ac_chrominance_values);
  }
  private initCategoryNumber() {
    let nrlower = 1;
    let nrupper = 2;
    for(let cat = 1;cat <= 15;cat++) {
      //Positive numbers
      for(let nr = nrlower;nr < nrupper;nr++) {
        this.category[32767+nr] = cat;
        this.bitcode[32767+nr] = [];
        this.bitcode[32767+nr][1] = cat;
        this.bitcode[32767+nr][0] = nr;
      }

      //Negative numbers
      for(let nrneg =-(nrupper-1);nrneg <= -nrlower;nrneg++) {
        this.category[32767+nrneg] = cat;
        this.bitcode[32767+nrneg] = [];
        this.bitcode[32767+nrneg][1] = cat;
        this.bitcode[32767+nrneg][0] = nrupper-1+nrneg;
      }
      nrlower <<= 1;
      nrupper <<= 1;
    }
  }
  private initRGBYUVTable() {
    for(let i = 0; i < 256;i++) {
      this.RGB_YUV_TABLE[i] =  19595 * i;
      this.RGB_YUV_TABLE[(i+ 256)>>0] =  38470 * i;
      this.RGB_YUV_TABLE[(i+ 512)>>0] =   7471 * i + 0x8000;
      this.RGB_YUV_TABLE[(i+ 768)>>0] = -11059 * i;
      this.RGB_YUV_TABLE[(i+1024)>>0] = -21709 * i;
      this.RGB_YUV_TABLE[(i+1280)>>0] =  32768 * i + 0x807FFF;
      this.RGB_YUV_TABLE[(i+1536)>>0] = -27439 * i;
      this.RGB_YUV_TABLE[(i+1792)>>0] = - 5329 * i;
    }
  }

  protected setQuality(quality: number) {
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
      this.YTable[ZigZag[i]] = t;
    }

    for(let j = 0; j < 64; j++) {
      let u = Math.floor((UVQT[j]*sf+50)/100);
      if (u < 1) {
        u = 1;
      } else if (u > 255) {
        u = 255;
      }
      this.UVTable[ZigZag[j]] = u;
    }
    let aasf = [
      1.0, 1.387039845, 1.306562965, 1.175875602,
      1.0, 0.785694958, 0.541196100, 0.275899379
    ];
    let k = 0;
    for(let row = 0; row < 8; row++) {
      for(let col = 0; col < 8; col++) {
        this.fdtbl_Y[k]  = (1.0 / (this.YTable [ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
        this.fdtbl_UV[k] = (1.0 / (this.UVTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
        k++;
      }
    }
  }
}