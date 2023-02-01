import { writeFileSync, unlinkSync } from "fs";
import { describe, expect, test } from "vitest";
import { resizeImage } from "./";
import { isBuffer } from "../../typeChecking/isBuffer";
import * as dotenv from "dotenv";
dotenv.config();

describe("#resizeImage", () => {
  let imagePath = `${process.env.TESTIMAGEFOLDER}/image2`;
  test("Verifica se todos os erros ocorrem como esperado", async () => {
    try {
      await resizeImage(`${imagePath}.jpg`, "" as any);
    } catch(error: any) {
      expect(error.message).toBe("widthAndHeightIsNotInAnObject");
    }

    try {
      await resizeImage(`${imagePath}.jpg`, undefined as any);
    } catch(error: any) {
      expect(error.message).toBe("widthAndHeightIsNotInAnObject");
    }

    try {
      await resizeImage(`${imagePath}.jpg`, null as any);
    } catch(error: any) {
      expect(error.message).toBe("widthAndHeightIsNotInAnObject");
    }
    
    try {
      await resizeImage(`${imagePath}.jpg`, {width: 10001, height: 400});
    } catch(error: any) {
      expect(error.message).toBe("widthOrHeightInvalidQuantity");
    }

    try {
      await resizeImage(`${imagePath}.jpg`, {width: 0, height: 400});
    } catch(error: any) {
      expect(error.message).toBe("widthOrHeightInvalidQuantity");
    }

    try {
      await resizeImage(`${imagePath}.jpg`, {width: 600, height: 10001});
    } catch(error: any) {
      expect(error.message).toBe("widthOrHeightInvalidQuantity");
    }

    try {
      await resizeImage(`${imagePath}.jpg`, {width: 600, height: 0});
    } catch(error: any) {
      expect(error.message).toBe("widthOrHeightInvalidQuantity");
    }

    try {
      await resizeImage(`${process.env.TESTUNSUPPORTEDIMAGEFOLDER}/test.js`, {width: 600, height: 400});
    } catch(error: any) {
      expect(error.message).toBe("pathDoesNotLeadToBuffer");
    }

    try {
      await resizeImage(process.env.TESTUNSUPPORTEDIMAGEFOLDER as string, {width: 600, height: 400});
    } catch(error: any) {
      expect(error).toBeInstanceOf(Error);
    }

  });
  test("Espera que o buffer seja retornado e o arquivo criado novamente", async () => {
    let buffer = await resizeImage(`${imagePath}.jpg`,  {width: 600, height: 400});
    expect(isBuffer(buffer)).toBe(true);
    unlinkSync(`${imagePath}.jpg`);
    writeFileSync(`${imagePath}.jpg`, buffer);
  });
});