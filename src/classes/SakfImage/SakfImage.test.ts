import { describe, test } from "vitest";
import { writeFileSync } from "fs";
import { SakfImage } from ".";
import { JPEGEncoder } from "../JPEG/JPEGEncoder";

describe("#SakfImage", () => {
  test("Verifica se o decoder funciona", async () => {
    let sakfImage = new SakfImage("C:/Users/User/Desktop/Lucas/repositories/publics/sakfjs/image.jpg");
    let resizedImage = await sakfImage.resize(8, 8);

    let encoder = new JPEGEncoder();
    let image = encoder.encode(resizedImage.buffer, 100);

    writeFileSync("C:/Users/User/Desktop/Lucas/repositories/publics/sakfjs/image2.jpg", image);
  });
});