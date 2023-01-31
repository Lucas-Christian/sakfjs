import { describe, test, expect } from "vitest";
import { readFileSync } from "fs";
import { isString } from "./isString";


describe("#isString", () => {
  const buffer = readFileSync("C:/Users/User/Pictures/testImage/image.png");
  test("Verifica se tudo retorna como esperado", () => {
    expect(isString(123 as any)).toBe(false);
    expect(isString("")).toBe(true);
    expect(isString("Hello")).toBe(true);
    expect(isString(["Hello", "World"] as any)).toBe(false);
    expect(isString({"Hello": "World"} as any)).toBe(false);
    expect(isString(null as any)).toBe(false);
    expect(isString(Infinity as any)).toBe(false);
    expect(isString(NaN as any)).toBe(false);
    expect(isString(undefined as any)).toBe(false);
    expect(isString(buffer as any)).toBe(false);
  });
});