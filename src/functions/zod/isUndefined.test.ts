import { describe, test, expect } from "vitest";
import { readFileSync } from "fs";
import { isUndefined } from "./isUndefined";


describe("#isUndefined", () => {
  const buffer = readFileSync("C:/Users/User/Pictures/testImage/image.png");
  test("Verifica se tudo retorna como esperado", () => {
    expect(isUndefined(123 as any)).toBe(false);
    expect(isUndefined("" as any)).toBe(false);
    expect(isUndefined("Hello" as any)).toBe(false);
    expect(isUndefined(["Hello", "World"] as any)).toBe(false);
    expect(isUndefined({"Hello": "World"} as any)).toBe(false);
    expect(isUndefined(undefined as any)).toBe(true);
    expect(isUndefined(NaN as any)).toBe(false);
    expect(isUndefined(Infinity as any)).toBe(false);
    expect(isUndefined(null as any)).toBe(false);
    expect(isUndefined(buffer as any)).toBe(false);
  });
});