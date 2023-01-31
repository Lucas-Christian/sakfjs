import { writeFileSync, unlinkSync } from "fs";
import { describe, expect, test } from "vitest";
import { changeQuality } from "./changeQuality";
import { isBuffer } from "../../../zod/isBuffer";

describe("#changeQuality", () => {
  let imagePath = "C:/Users/User/Pictures/testImage/image";
  test("Verifica se todos os erros ocorrem como esperado", async () => {
    try {
      await changeQuality(`${imagePath}2.png`, "" as any);
    } catch(error: any) {
      expect(error.message).toBe("isNotNumber");
    }

    try {
      await changeQuality(`${imagePath}2.png`, undefined as any);
    } catch(error: any) {
      expect(error.message).toBe("isNotNumber");
    }

    try {
      await changeQuality(`${imagePath}2.png`, null as any);
    } catch(error: any) {
      expect(error.message).toBe("isNotNumber");
    }

    try {
      await changeQuality("C:/Users/User/Pictures/testImagesUnsupported/test.js", 100);
    } catch(error: any) {
      expect(error.message).toBe("pathDoesNotLeadToBuffer");
    }

    try {
      await changeQuality("C:/Users/User/Pictures/testImagesUnsupported", 100);
    } catch(error: any) {
      expect(error).toBeInstanceOf(Error);
    }

  });
  test("Espera que o buffer seja retornado e o arquivo criado novamente", async () => {
    let buffer = await changeQuality(`${imagePath}.png`, 100);
    expect(isBuffer(buffer)).toBe(true);
    unlinkSync(`${imagePath}.png`);
    writeFileSync(`${imagePath}.png`, buffer);
  });
});