import type { Stats, PathLike } from "fs";
import { stat } from "fs";

/**
 * @function getStat
 * @description stat of fs as a promise
 * 
 * @param {PathLike} path
 * @returns {Promise<unknown>}
 */

export function getStat(path: PathLike): Promise<unknown> {
  return new Promise((resolve, reject) => {
    stat(path, (err: NodeJS.ErrnoException | null, stat: Stats) => {
      if(err) return reject(err);
      return resolve(stat);
    });
  });
}