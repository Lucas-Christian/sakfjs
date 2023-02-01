import { describe, test, expect } from "vitest";
import { isASupportedImage } from "./";

describe("#isASupportedImage", () => {
  test("Os erros de não ser string, e string vazia devem ser jogados", () => {
    expect(() => isASupportedImage("")).toThrowError("filenameOrPathEmptyOrIsNotString");

    expect(() => isASupportedImage(123 as any)).toThrowError("isNotString");
  });
  test("Verifica se é válido de diferentes formas, é esperado que todas sejam verdadeiras", () => {
    let checkedExtOrMIMEType = isASupportedImage("jpg");
    expect(checkedExtOrMIMEType).toBe(true);

    checkedExtOrMIMEType = isASupportedImage("png");
    expect(checkedExtOrMIMEType).toBe(true);

    checkedExtOrMIMEType = isASupportedImage("image/jpeg");
    expect(checkedExtOrMIMEType).toBe(true);

    checkedExtOrMIMEType = isASupportedImage("image/png");
    expect(checkedExtOrMIMEType).toBe(true);

    checkedExtOrMIMEType = isASupportedImage("C:/Users/User/Pictures/testImage/image.png");
    expect(checkedExtOrMIMEType).toBe(true);

    checkedExtOrMIMEType = isASupportedImage(".jpg");
    expect(checkedExtOrMIMEType).toBe(true);

    checkedExtOrMIMEType = isASupportedImage(".png");
    expect(checkedExtOrMIMEType).toBe(true);
  });
});