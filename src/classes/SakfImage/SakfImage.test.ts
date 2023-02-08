import { describe, test } from "vitest";
import { SakfImage } from ".";

describe("#SakfImage", () => {
  test("Verifica se o decoder funciona", async () => {
    let sakfImage = new SakfImage("image.jpeg");
    console.log(sakfImage.resize(8, 8));
  });
});