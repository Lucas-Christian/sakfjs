import { describe, expect, test } from "vitest";
import { getStat } from "./";
import { Stats } from "fs";
import * as dotenv from "dotenv";
dotenv.config();

describe("#getStat", () => {
  let testFolderPath = process.env.TESTIMAGEFOLDER as string;
  test("É esperado que o getStat rejeite a promessa", async () => {
    try {
      await getStat(123 as any) as unknown as NodeJS.ErrnoException;
    } catch(error: any) {
      expect(error.code !== undefined && error.code !== null).toBe(true);
    }
  });
  test("É esperado que o getStat seja um sucesso", async () => {
    let stats = await getStat(testFolderPath);
    expect(stats instanceof Stats).toBe(true);
    expect(stats.isDirectory()).toBe(true);
    expect(stats.isFile()).toBe(false);
  });
  test("É esperado que o getStat seja um sucesso", async () => {
    let stats = await getStat(`${testFolderPath}/image2.jpg`);
    expect(stats instanceof Stats).toBe(true);
    expect(stats.isDirectory()).toBe(false);
    expect(stats.isFile()).toBe(true);
  });
});