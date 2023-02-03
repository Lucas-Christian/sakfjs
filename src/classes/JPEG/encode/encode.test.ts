import { describe, test } from "vitest";
import { encode } from ".";

type ImageType = { buffer: Buffer, width: number, height: number };

let image = {
  width: 16,
  height: 16
} as ImageType;

let buffer = Buffer.alloc(image.width * image.height * 4);

let i = 0;
do {
  buffer[i++] = 0xff; // red
  buffer[i++] = 0x00; // green
  buffer[i++] = 0x00; // blue
  buffer[i++] = 0xff; // alpha - ignored in JPEGs
} while(i < buffer.length);

image.buffer = buffer;

describe("#JPEGEncoder", () => {
  test("Verifica se o encoder funciona", () => {
    
    encode(image, 60);
    // let encodedImage = encoder.encode(image, 60);

    // console.log(encodedImage);
  });
});
