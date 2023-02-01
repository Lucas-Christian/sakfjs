import { test, describe, expect } from "vitest";
import { getMIMEType } from ".";

describe("#getMIMEType", () => {
  test("Espera que um erro ocorra por string vazia", () => {
    expect(() => getMIMEType("")).toThrowError("filenameOrPathEmptyOrIsNotString");
  });
  test("Espera que um erro ocorra por tipo incorreto", () => {
    expect(() => getMIMEType(123 as any)).toThrowError("filenameOrPathEmptyOrIsNotString");
  });
  test("Espera que um erro ocorra por tipo inexistente", () => {
    expect(() => getMIMEType("arquivo")).toThrowError("extensionNotFound");
  });
  test("Espera que o tipo seja undefined", () => {
    let mime = getMIMEType("arquivo.dadawdd");
    expect(mime).toBe(undefined);
  });
  test("Espera retornar as possíveis extensões do MIME type image/jpeg", () => {
    let mime = getMIMEType("image.jpg");
    expect(mime).toStrictEqual("image/jpeg");
    
    mime = getMIMEType(".jpg");
    expect(mime).toStrictEqual("image/jpeg");

    mime = getMIMEType("jpg");
    expect(mime).toStrictEqual("image/jpeg");
  });
});