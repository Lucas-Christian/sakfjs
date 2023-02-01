import { describe, test, expect } from "vitest";
import { readFileSync } from "fs";
import { isBuffer } from "./";
import * as dotenv from "dotenv";
dotenv.config();

describe("#isBuffer", () => {
  const buffer = readFileSync(`${process.env.TESTIMAGEFOLDER}/image2.jpg`);
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