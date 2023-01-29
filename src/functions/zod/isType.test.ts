import { isString, isNumber, isArray, isBuffer, isUndefined } from "./isType";
import { describe, test, expect } from "vitest";
import { readFileSync } from "fs";


describe("#isType", () => {
  const buffer = readFileSync("C:/Users/User/Pictures/testImage/image.png");
  test("isString", () => {
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
  test("isNumber", () => {
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
  test("isArray", () => {
    expect(isArray(123 as any)).toBe(false);
    expect(isArray("" as any)).toBe(false);
    expect(isArray("Hello" as any)).toBe(false);
    expect(isArray(["Hello", "World"])).toBe(true);
    expect(isArray({"Hello": "World"} as any)).toBe(false);
    expect(isArray(undefined as any)).toBe(false);
    expect(isArray(NaN as any)).toBe(false);
    expect(isArray(Infinity as any)).toBe(false);
    expect(isArray(null as any)).toBe(false);
    expect(isArray(buffer as any)).toBe(false);
  });
  test("isBuffer", () => {
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
  test("isUndefined", () => {
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