import { test, describe, expect } from "vitest";
import { getMIMEType } from "./getMIMEType";

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
  test("Espera que um erro ocorra por tipo inexistente", () => {
    expect(() => getMIMEType("arquivo.dadawdd")).toThrowError("MIMETypeNotFound");
  });
  test("Espera retornar as possíveis extensões do MIME type image/jpeg", () => {
    let extensions = getMIMEType("image.jpg");
    expect(extensions).toStrictEqual("image/jpeg");
    
    extensions = getMIMEType(".jpg");
    expect(extensions).toStrictEqual("image/jpeg");

    extensions = getMIMEType("jpg");
    expect(extensions).toStrictEqual("image/jpeg");
  });
});