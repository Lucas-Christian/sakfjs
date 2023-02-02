import { isBuffer } from "../../resources/typeChecking/isBuffer";
import { isNumber } from "../../resources/typeChecking/isNumber";
import { isObject } from "../../resources/typeChecking/isObject";

type ImageType = { buffer: Buffer, width: number, height: number };

class JPEGEncoder {
  #currentQuality: number;
  #targetQuality: number;

  constructor(quality: number = 50) {
    if(!isNumber(quality)) throw new Error("invalidQuality");
    this.#targetQuality = quality;
  }
  public encode(image: ImageType, quality: number) {
    if(!isNumber(quality)) throw new Error("invalidQuality");
    else if(this.#currentQuality === quality) throw new Error("currentQualityEqualTargetQuality");
    else if(quality <= 0 || quality > 100) throw new Error("invalidQuality");
    else if(!isObject(image)) throw new Error("invalidImage");
    let { width, height, buffer } = image;
  
    if(!isBuffer(buffer)) throw new Error("invalidImageBuffer");
    else if(!isNumber(width) || !isNumber(height)) throw new Error("widthOrHeightIsNotNumber");
    else if(width < 1 || width > 10000) throw new Error("widthInvalidQuantity");
    else if(height < 1 || height > 10000) throw new Error("HeightInvalidQuantity");

    

    // Subdividir a imagem em blocos de pixels 8x8*;
    // para cada um dos blocos de pixels faça:
    //   subtraia 128 do valor de cada pixel;
    //   calcular o DCT para o bloco;
    //   quantize os coeficientes DCT;
    //   organize os coeficientes quantizados em um array 1D;
    //   aplique Delta encoding para o primeiro(zero frequency) coeficiente;
    //   aplique RLE para comprimir o coeficiente de valor zero;
    //   aplique Huffman coding para os coeficientes;
    //   retornar os coeficientes codificados para o bloco;
    // fim_faça

    // No final de tudo fazer targetQuality ficar undefined
    this.#targetQuality = undefined as any;
    // Retornar dados
  }
}