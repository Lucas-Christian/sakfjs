import type { Bitmap } from "@classes/ImageDecoder/Base";
import { interpolate2D } from "./functions/interpolate2D";
import { interpolate } from "./functions/interpolate";
import { interpolateBezier } from "./functions/interpolateBezier";

export const resizeOperations = {
  nearestNeighbor(src: Bitmap, dst: Bitmap) {
    const wSrc = src.width;
    const hSrc = src.height;

    const wDst = dst.width;
    const hDst = dst.height;

    const bufSrc = src.buffer;
    const bufDst = dst.buffer;

    for(let i = 0; i < hDst; i++) {
      for(let j = 0; j < wDst; j++) {
        let posDst = (i * wDst + j) * 4;

        const iSrc = Math.floor((i * hSrc) / hDst);
        const jSrc = Math.floor((j * wSrc) / wDst);
        let posSrc = (iSrc * wSrc + jSrc) * 4;

        bufDst[posDst++] = bufSrc[posSrc++];
        bufDst[posDst++] = bufSrc[posSrc++];
        bufDst[posDst++] = bufSrc[posSrc++];
        bufDst[posDst++] = bufSrc[posSrc++];
      }
    }
  },
  bilinearInterpolation(src: Bitmap, dst: Bitmap) {
    const wSrc = src.width;
    const hSrc = src.height;

    const wDst = dst.width;
    const hDst = dst.height;

    const bufSrc = src.buffer;
    const bufDst = dst.buffer;

    for(let i = 0; i < hDst; i++) {
      for(let j = 0; j < wDst; j++) {
        const posDst = (i * wDst + j) * 4;
        // x & y in src coordinates
        const x = (j * wSrc) / wDst;
        const xMin = Math.floor(x);
        const xMax = Math.min(Math.ceil(x), wSrc - 1);

        const y = (i * hSrc) / hDst;
        const yMin = Math.floor(y);
        const yMax = Math.min(Math.ceil(y), hSrc - 1);

        assign(0);
        assign(1);
        assign(2);
        assign(3);

        function assign(offset: number) {
          let posMin = (yMin * wSrc + xMin) * 4 + offset;
          let posMax = (yMin * wSrc + xMax) * 4 + offset;
          const vMin = interpolate(x, xMin, bufSrc[posMin], xMax, bufSrc[posMax]);
    
          // special case, y is integer
          if(yMax === yMin) {
            bufDst[posDst + offset] = vMin;
          } else {
            posMin = (yMax * wSrc + xMin) * 4 + offset;
            posMax = (yMax * wSrc + xMax) * 4 + offset;
            const vMax = interpolate(x, xMin, bufSrc[posMin], xMax, bufSrc[posMax]);
    
            bufDst[posDst + offset] = interpolate(y, yMin, vMin, yMax, vMax);
          }
        }
      }
    }

  },
  bicubicInterpolation(src: Bitmap, dst: Bitmap) {
    const interpolateCubic = function (x0: number, x1: number, x2: number, x3: number, t: number) {
      const a0 = x3 - x2 - x0 + x1;
      const a1 = x0 - x1 - a0;
      const a2 = x2 - x0;
      const a3 = x1;
      return Math.max(
        0,
        Math.min(255, a0 * (t * t * t) + a1 * (t * t) + a2 * t + a3)
      );
    };

    return interpolate2D(src, dst, interpolateCubic);
  },
  hermiteInterpolation(src: Bitmap, dst: Bitmap) {
    const interpolateHermite = function (x0: number, x1: number, x2: number, x3: number, t: number) {
      const c0 = x1;
      const c1 = 0.5 * (x2 - x0);
      const c2 = x0 - 2.5 * x1 + 2 * x2 - 0.5 * x3;
      const c3 = 0.5 * (x3 - x0) + 1.5 * (x1 - x2);
      return Math.max(
        0,
        Math.min(255, Math.round(((c3 * t + c2) * t + c1) * t + c0))
      );
    };

    return interpolate2D(src, dst, interpolateHermite);
  },
  bezierInterpolation(src: Bitmap, dst: Bitmap) {
    return interpolate2D(src, dst, interpolateBezier);
  }
};