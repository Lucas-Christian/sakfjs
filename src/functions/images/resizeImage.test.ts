import { writeFileSync, unlinkSync } from "fs";
import { describe, expect, test } from "vitest";
import { resizeImage } from "./resizeImage";
import { isBuffer } from "../zod/isType";

describe("#resizeImage", () => {
  let imagePath = "C:/Users/User/Pictures/testImage/image";
  test("Verifica se todos os erros ocorrem como esperado", async () => {
    try {
      await resizeImage(`${imagePath}2.png`, "" as any);
    } catch(error: any) {
      expect(error.message).toBe("widthAndHeightIsNotInAnObject");
    }

    try {
      await resizeImage(`${imagePath}2.png`, undefined as any);
    } catch(error: any) {
      expect(error.message).toBe("widthAndHeightIsNotInAnObject");
    }

    try {
      await resizeImage(`${imagePath}2.png`, null as any);
    } catch(error: any) {
      expect(error.message).toBe("widthAndHeightIsNotInAnObject");
    }
    
    try {
      await resizeImage(`${imagePath}2.png`, {width: 10001, height: 400});
    } catch(error: any) {
      expect(error.message).toBe("widthOrHeightInvalidQuantity");
    }

    try {
      await resizeImage(`${imagePath}2.png`, {width: 0, height: 400});
    } catch(error: any) {
      expect(error.message).toBe("widthOrHeightInvalidQuantity");
    }

    try {
      await resizeImage(`${imagePath}2.png`, {width: 600, height: 10001});
    } catch(error: any) {
      expect(error.message).toBe("widthOrHeightInvalidQuantity");
    }

    try {
      await resizeImage(`${imagePath}2.png`, {width: 600, height: 0});
    } catch(error: any) {
      expect(error.message).toBe("widthOrHeightInvalidQuantity");
    }

    try {
      await resizeImage("C:/Users/User/Pictures/testImagesUnsupported/test.js", {width: 600, height: 400});
    } catch(error: any) {
      expect(error.message).toBe("pathDoesNotLeadToBuffer");
    }

    try {
      await resizeImage("C:/Users/User/Pictures/testImagesUnsupported", {width: 600, height: 400});
    } catch(error: any) {
      expect(error).toBeInstanceOf(Error);
    }

  });
  test("Espera que o buffer seja retornado e o arquivo criado novamente", async () => {
    let buffer = await resizeImage(`${imagePath}.png`,  {width: 600, height: 400});
    expect(isBuffer(buffer)).toBe(true);
    unlinkSync(`${imagePath}.png`);
    writeFileSync(`${imagePath}.png`, buffer);
  });
});