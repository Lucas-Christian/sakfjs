import type { PathLike } from "fs";
import { readFile } from "fs";

export function readSomeFile(path: PathLike): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    readFile(path, (err: NodeJS.ErrnoException | null, data: Buffer) => {
      if(err) return reject(err);
      return resolve(data);
    });
  });
}