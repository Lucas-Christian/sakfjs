import { describe, test, expect } from "vitest";
import { readFileSync } from "fs";
import { isObject } from "./isObject";


describe("#isObject", () => {
  const buffer = readFileSync("C:/Users/User/Pictures/testImage/image.png");
  test("Verifica se tudo retorna como esperado", () => {
    expect(isObject(123 as any)).toBe(false);
    expect(isObject("" as any)).toBe(false);
    expect(isObject("Hello" as any)).toBe(false);
    expect(isObject(["Hello", "World"] as any)).toBe(false);
    expect(isObject({"Hello": "World"} as any)).toBe(true);
    expect(isObject(undefined as any)).toBe(false);
    expect(isObject(NaN as any)).toBe(false);
    expect(isObject(Infinity as any)).toBe(false);
    expect(isObject(null as any)).toBe(false);
    expect(isObject(buffer as any)).toBe(false);
  });
});