import { describe, test, expect } from "vitest";
import { getSupportedImages } from "./getSupportedImages";

describe("#getSupportedImages", () => {
  test("Todos os erros esperados devem ser jogados", async () => {
    try {
      await getSupportedImages("C:/Users/User/Pictures/testImageEmpty");
    } catch(error) {
      expect(error.message).toBe("emptyFolder")
    }

    try {
      await getSupportedImages("C:/Users/User/Pictures/testImagesUnsupported");
    } catch(error) {
      expect(error.message).toBe("dontHasSupportedImages");
    }

    try {
      await getSupportedImages(123 as any);
    } catch(error) {
      expect(error.message).toBe("folderPathEmptyOrIsNotString");
    }

    try {
      await getSupportedImages("");
    } catch(error) {
      expect(error.message).toBe("folderPathEmptyOrIsNotString");
    }

    try {
      await getSupportedImages(undefined as any);
    } catch(error) {
      expect(error.message).toBe("undefinedFolderPath");
    }
  });
  test("É esperado que o array das imagens suportadas seja retornado",  async () => {
    const images = await getSupportedImages("C:/Users/User/Pictures/testImage");
    expect(images instanceof Array).toBe(true);
  });
});