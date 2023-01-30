import { describe, test, expect } from "vitest";
import { isASupportedImage } from "./isASupportedImage";

describe("#isASupportedImage", () => {
  test("É esperado que seja falso", () => {
    let checkedExtOrMIMEType = isASupportedImage("");
    expect(checkedExtOrMIMEType).toBe(false);

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