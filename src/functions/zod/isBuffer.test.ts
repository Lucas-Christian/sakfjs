import { isBuffer } from "./isBuffer";
import { describe, test, expect } from "vitest";
import { readFileSync } from "fs";


describe("#isBuffer", () => {
  const buffer = readFileSync("C:/Users/User/Pictures/testImage/image.png");
  test("Verifica se tudo retorna como esperado", () => {
    expect(isBuffer(123 as any)).toBe(false);
    expect(isBuffer("" as any)).toBe(false);
    expect(isBuffer("Hello" as any)).toBe(false);
    expect(isBuffer(["Hello", "World"])).toBe(false);
    expect(isBuffer({"Hello": "World"} as any)).toBe(false);
    expect(isBuffer(undefined as any)).toBe(false);
    expect(isBuffer(NaN as any)).toBe(false);
    expect(isBuffer(Infinity as any)).toBe(false);
    expect(isBuffer(null as any)).toBe(false);
    expect(isBuffer(buffer as any)).toBe(true);
  });
});