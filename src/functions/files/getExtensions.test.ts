import { test, describe, expect } from "vitest";
import { getExtensions } from "./getExtensions";

describe("#getExtensions", () => {
  test("Espera que um erro ocorra por string vazia", () => {
    expect(getExtensions("")).toThrowError();
  });
  test("Espera que um erro ocorra por tipo inexistente", () => {
    expect(getExtensions("adawdad/dad")).toThrowError();
  });
  test("Espera que um erro ocorra por tipo incorreto", () => {
    expect(getExtensions(123 as any)).toThrowError();
  });
  test("Espera retornar as possíveis extensões do MIME type image/jpeg", () => {
    const extensions = getExtensions("image/jpeg");
    expect(extensions).toBe([".jpeg", ".jpg", ".jpe"]);
  });
});