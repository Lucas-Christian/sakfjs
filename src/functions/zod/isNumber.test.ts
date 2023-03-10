import { describe, test, expect } from "vitest";
import { readFileSync } from "fs";
import { isNumber } from "./isNumber";


describe("#isNumber", () => {
  const buffer = readFileSync("C:/Users/User/Pictures/testImage/image.png");
  test("Verifica se tudo retorna como esperado", () => {
    expect(isNumber(123)).toBe(true);
    expect(isNumber("" as any)).toBe(false);
    expect(isNumber("Hello" as any)).toBe(false);
    expect(isNumber(["Hello", "World"] as any)).toBe(false);
    expect(isNumber({"Hello": "World"} as any)).toBe(false);
    expect(isNumber(undefined as any)).toBe(false);
    expect(isNumber(NaN)).toBe(false);
    expect(isNumber(Infinity)).toBe(false);
    expect(isNumber(null as any)).toBe(false);
    expect(isNumber(buffer as any)).toBe(false);
  });
});