import { writeFileSync, unlinkSync } from "fs";
import { describe, expect, test } from "vitest";
import { changeQuality } from "./";
import { isBuffer } from "../../typeChecking/isBuffer";
import * as dotenv from "dotenv";
dotenv.config();

describe("#changeQuality", () => {
  let imagePath = `${process.env.TESTIMAGEFOLDER}/image2`;
  test("Verifica se todos os erros ocorrem como esperado", async () => {
    try {
      await changeQuality(`${imagePath}.jpg`, "" as any);
    } catch(error: any) {
      expect(error.message).toBe("isNotNumber");
    }

    try {
      await changeQuality(`${imagePath}.jpg`, undefined as any);
    } catch(error: any) {
      expect(error.message).toBe("isNotNumber");
    }

    try {
      await changeQuality(`${imagePath}.jpg`, null as any);
    } catch(error: any) {
      expect(error.message).toBe("isNotNumber");
    }

    try {
      await changeQuality(`${process.env.TESTUNSUPPORTEDIMAGEFOLDER}/test.js`, 100);
    } catch(error: any) {
      expect(error.message).toBe("pathDoesNotLeadToBuffer");
    }

    try {
      await changeQuality(process.env.TESTUNSUPPORTEDIMAGEFOLDER as string, 100);
    } catch(error: any) {
      expect(error).toBeInstanceOf(Error);
    }

  });
  test("Espera que o buffer seja retornado e o arquivo criado novamente", async () => {
    let buffer = await changeQuality(`${imagePath}.jpg`, 100);
    expect(isBuffer(buffer)).toBe(true);
    unlinkSync(`${imagePath}.jpg`);
    writeFileSync(`${imagePath}.jpg`, buffer);
  });
});