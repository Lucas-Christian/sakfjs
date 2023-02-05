import { promisifyReadFile } from "../../../resources/native/promisifyReadFile";
import { describe, test } from "vitest";
import { JPEGDecoder } from ".";

describe("#JPEGDecoder", () => {
  test("Verifica se o decoder funciona", async () => {
    let decoder = new JPEGDecoder();

    let jpegData = promisifyReadFile("image.jpg");
    let rawImageData = decoder.decode(await jpegData);
    console.log(rawImageData);
  });
});