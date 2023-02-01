import { describe, test, expect } from "vitest";
import { getSupportedImages } from "./";
import * as dotenv from "dotenv";
dotenv.config();

describe("#getSupportedImages", () => {
  test("Todos os erros esperados devem ser jogados", async () => {
    try {
      await getSupportedImages(process.env.TESTEMPTYIMAGEFOLDER as string);
    } catch(error: any) {
      expect(error.message).toBe("emptyFolder")
    }

    try {
      await getSupportedImages(process.env.TESTUNSUPPORTEDIMAGEFOLDER as string);
    } catch(error: any) {
      expect(error.message).toBe("dontHasSupportedImages");
    }

    try {
      await getSupportedImages(123 as any);
    } catch(error: any) {
      expect(error.message).toBe("folderPathEmptyOrIsNotString");
    }

    try {
      await getSupportedImages("");
    } catch(error: any) {
      expect(error.message).toBe("folderPathEmptyOrIsNotString");
    }

    try {
      await getSupportedImages(undefined as any);
    } catch(error: any) {
      expect(error.message).toBe("undefinedFolderPath");
    }
  });
  test("É esperado que o array das imagens suportadas seja retornado",  async () => {
    const images = await getSupportedImages(process.env.TESTIMAGEFOLDER as string);
    expect(images instanceof Array).toBe(true);
  });
});