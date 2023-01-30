import { writeFileSync, unlinkSync } from "fs";
import { describe, expect, test } from "vitest";
import { changeExtension } from "./changeExtension";
import { getMIMEType } from "../files/getMIMEType";
import { isBuffer } from "../zod/isType";
import { parse } from "path";

describe("#changeExtension", () => {
  let imagePath = "C:/Users/User/Pictures/testImage/image";
  test("Verifica se todos os erros ocorrem como esperado", async () => {
    try {
      await changeExtension(`${imagePath}2.png`, "" as any);
    } catch(error: any) {
      expect(error.message).toBe("unsupportedImage");
    }

    try {
      await changeExtension(`${imagePath}2.png`, undefined as any);
    } catch(error: any) {
      expect(error.message).toBe("unsupportedImage");
    }

    try {
      await changeExtension(`${imagePath}2.png`, 123 as any);
    } catch(error: any) {
      expect(error.message).toBe("isNotString");
    }

    try {
      await changeExtension("C:/Users/User/Pictures/testImagesUnsupported/test.js", "jpg");
    } catch(error: any) {
      expect(error.message).toBe("pathDoesNotLeadToBuffer");
    }

    try {
      await changeExtension("C:/Users/User/Pictures/testImagesUnsupported", "jpg");
    } catch(error: any) {
      expect(error).toBeInstanceOf(Error);
    }

  });
  test("Espera que o buffer seja retornado e a extensão do arquivo seja mudada com diferentes parâmetros", async () => {
    let image = parse(`${imagePath}.png`);
    let buffer = await changeExtension(`${image.dir}/${image.base}`, (image.ext === ".png" ? "jpg" : "png"));
    expect(isBuffer(buffer)).toBe(true);
    writeFileSync(`${image.dir}/${image.name}${(image.ext === ".png" ? ".jpg" : ".png")}`, buffer);
    unlinkSync(`${imagePath}.png`);
    
    image = parse(`${imagePath}.jpg`);
    buffer = await changeExtension(`${image.dir}/${image.base}`, (image.ext === ".png" ? ".jpg" : ".png"));
    expect(isBuffer(buffer)).toBe(true);
    writeFileSync(`${image.dir}/${image.name}${(image.ext === ".png" ? ".jpg" : ".png")}`, buffer);
    unlinkSync(`${imagePath}.jpg`);
    
    image = parse(`${imagePath}.png`);
    let MIMEType = getMIMEType(image.ext);
    buffer = await changeExtension(`${image.dir}/${image.base}`, (MIMEType === "image/png" ? "image/jpeg" : "image/png"));
    expect(isBuffer(buffer)).toBe(true);
    writeFileSync(`${image.dir}/${image.name}${(image.ext === ".png" ? ".jpg" : ".png")}`, buffer);    
    unlinkSync(`${imagePath}.png`);
    
    image = parse(`${imagePath}.jpg`);
    MIMEType = getMIMEType(image.ext);
    buffer = await changeExtension(`${image.dir}/${image.base}`, (MIMEType === "image/png" ? "image/jpeg" : "image/png"));
    expect(isBuffer(buffer)).toBe(true);
    writeFileSync(`${image.dir}/${image.name}${(image.ext === ".png" ? ".jpg" : ".png")}`, buffer);  
    unlinkSync(`${imagePath}.jpg`);
  });
});