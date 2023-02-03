import { isBuffer } from "../../../resources/typeChecking/isBuffer";
import { isNumber } from "../../../resources/typeChecking/isNumber";
import { isObject } from "../../../resources/typeChecking/isObject";

type ImageType = { buffer: Buffer, width: number, height: number };
type RGBPixel = { red: number, green: number, blue: number };
type YCbCrPixel = { Y: number, Cb: number, Cr: number };

export class JPEGEncoder {
  public encode(image: ImageType, quality: number = 50) {
    if(!isNumber(quality)) throw new Error("invalidQuality");
    else if(quality <= 0 || quality > 100) throw new Error("invalidQuality");
    else if(!isObject(image)) throw new Error("invalidImage");
    let { width, height, buffer } = image;
  
    if(!isBuffer(buffer)) throw new Error("invalidImageBuffer");
    else if(!isNumber(width) || !isNumber(height)) throw new Error("widthOrHeightIsNotNumber");
    else if(width < 1 || width > 10000) throw new Error("widthInvalidQuantity");
    else if(height < 1 || height > 10000) throw new Error("HeightInvalidQuantity");

    let pixelBlocks8x8 = this.subdivideImageInto8x8PixelBlocks(buffer);

    console.log(pixelBlocks8x8);

    return buffer;
    
    let encodedImage;

    pixelBlocks8x8.forEach((pixelBlock) => {
      let DCTCoefficients = this.calculateDCTForThePixelBlock(pixelBlock),
      quantizedDCTCoefficients = this.quantizeTheDCTCoefficients(DCTCoefficients),
      organizedQuantizedCoefficients = this.organizeQuantizedCoefficients(quantizedDCTCoefficients);

      let coefficients = this.deltaEnconding(organizedQuantizedCoefficients);

      coefficients = this.runLengthEncoding(coefficients);

      let encodedCoefficients = this.huffmanEconding(coefficients);

      encodedImage.write(encodedCoefficients);
    });

    return encodedImage;
  }
  private subdivideImageInto8x8PixelBlocks(buffer: Buffer) {
    let pixelBlocks8x8: YCbCrPixel[][] = [];
    let pixelBlock: YCbCrPixel[] = [];
    let actualByte = 0;

    for(let i = 0;i <= buffer.length;i = i+4) {
      if(actualByte === 8 || i >= buffer.length) {
        pixelBlocks8x8.push(pixelBlock);
        pixelBlock = [];
        actualByte = 0;
      }

      let rgbPixel = {
        red: buffer[i],
        green: buffer[i + 1],
        blue: buffer[i + 2]
      } as RGBPixel;

      let yCbCrPixel = transformRGBAToYCbCr(rgbPixel);

      pixelBlock.push(yCbCrPixel); 
      actualByte++;
    }
    return pixelBlocks8x8;
  
    function transformRGBAToYCbCr({ red, green, blue }: RGBPixel) {
      let pixel = {
        Y: calculateY(),
        Cb: calculateCb(),
        Cr: calculateCr()
      } as YCbCrPixel;

      function calculateY() {
        let calculateRed =(red << 6) + (red << 1),
        calculateGreen = (green << 7) + green,
        calculateBlue = (blue << 4) + (blue << 3) + blue;
        return 16 + (calculateRed + calculateGreen + calculateBlue >> 8);
      }
      function calculateCb() {
        let calculateRed = (red << 5) + (red << 2) + (red << 1),
        calculateGreen = (green << 6) + (green << 3) + (green << 1),
        calculateBlue = (blue << 7) - (blue << 4);

        return 128 +((-((calculateRed) - (calculateGreen) + calculateBlue)) >> 8);
      }
      function calculateCr() {
        let calculateRed = (red << 7) - (red << 4),
        calculateGreen = (green << 6) + (green << 5) - (green << 1),
        calculateBlue = (blue << 4) + (blue << 1);

        return 128 + ((calculateRed - (calculateGreen) - (calculateBlue)) >> 8);
      }

      return pixel;
    }
  }
  private calculateDCTForThePixelBlock(pixelBlock: YCbCrPixel[]) {
    let DCTCoefficients;

    return DCTCoefficients;
  }
  private quantizeTheDCTCoefficients(DCTCoefficients) {
    let quantizedTheDCTCoefficients;

    return quantizedTheDCTCoefficients;
  }
  private organizeQuantizedCoefficients(quantizedDCTCoefficients) {
    let organizedQuantizedCoefficients = [];

    return organizedQuantizedCoefficients;
  }
  private deltaEnconding(firstZeroFrequencyCoefficient) {
    let encodedFirstCoefficient;

    return encodedFirstCoefficient;
  }
  private runLengthEncoding(zeroValueCoefficient) {
    let encodedCoefficients;

    return encodedCoefficients;
  }
  private huffmanEconding(coefficients) {
    let encodedCoefficients;
    return encodedCoefficients;
  }
}