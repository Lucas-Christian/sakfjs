import { test, describe, expect } from "vitest";
import { getExtensions } from "./";

describe("#getExtensions", () => {
  test("Espera que um erro ocorra por string vazia", () => {
    expect(() => getExtensions("")).toThrowError("MIMETypeEmptyOrIsNotString");
  });
  test("Espera que um erro ocorra por tipo incorreto", () => {
    expect(() => getExtensions(123 as any)).toThrowError("MIMETypeEmptyOrIsNotString");
  });
  test("Espera que o tipo seja undefined", () => {
    let extensions = getExtensions("adawdad/dad");
    expect(extensions).toBe(undefined);
  });
  test("Espera retornar as possíveis extensões do MIME type image/jpeg", () => {
    let extensions = getExtensions("image/jpeg");
    expect(extensions).toStrictEqual([".jpeg", ".jpg", ".jpe"]);
  });
});