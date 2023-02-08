import type { Bitmap } from "@classes/ImageDecoder/Base";

type Interpolate = (k: number, kMin: number, vMin: number, kMax: number, vMax: number) => number;

export function interpolate2D(src: Bitmap, dst: Bitmap, interpolate: Interpolate) {
  const bufSrc = src.buffer;
  const bufDst = dst.buffer;

  const wSrc = src.width;
  const hSrc = src.height;

  const wDst = dst.width;
  const hDst = dst.height;

  // when dst smaller than src/2, interpolate first to a multiple between 0.5 and 1.0 src, then sum squares
  const wM = Math.max(1, Math.floor(wSrc / wDst));
  const wDst2 = wDst * wM;
  const hM = Math.max(1, Math.floor(hSrc / hDst));
  const hDst2 = hDst * hM;

  // ===========================================================
  // Pass 1 - interpolate rows
  // buf1 has width of dst2 and height of src
  const buf1 = Buffer.alloc(wDst2 * hSrc * 4);
  for(let i = 0; i < hSrc; i++) {
    for(let j = 0; j < wDst2; j++) {
      // i in src coords, j in dst coords

      // calculate x in src coords
      // this interpolation requires 4 sample points and the two inner ones must be real
      // the outer points can be fudged for the edges.
      // therefore (wSrc-1)/wDst2
      const x = (j * (wSrc - 1)) / wDst2;
      const xPos = Math.floor(x);
      const t = x - xPos;
      const srcPos = (i * wSrc + xPos) * 4;
      const buf1Pos = (i * wDst2 + j) * 4;

      for(let k = 0; k < 4; k++) {
        const kPos = srcPos + k;
        const x0 =
          xPos > 0 ? bufSrc[kPos - 4] : 2 * bufSrc[kPos] - bufSrc[kPos + 4];
        const x1 = bufSrc[kPos];
        const x2 = bufSrc[kPos + 4];
        const x3 =
          xPos < wSrc - 2
            ? bufSrc[kPos + 8]
            : 2 * bufSrc[kPos + 4] - bufSrc[kPos];
        buf1[buf1Pos + k] = interpolate(x0, x1, x2, x3, t);
      }
    }
  }
  // this._writeFile(wDst2, hSrc, buf1, "out/buf1.jpg");

  // ===========================================================
  // Pass 2 - interpolate columns
  // buf2 has width and height of dst2
  const buf2 = Buffer.alloc(wDst2 * hDst2 * 4);
  for(let i = 0; i < hDst2; i++) {
    for(let j = 0; j < wDst2; j++) {
      // i&j in dst2 coords

      // calculate y in buf1 coords
      // this interpolation requires 4 sample points and the two inner ones must be real
      // the outer points can be fudged for the edges.
      // therefore (hSrc-1)/hDst2
      const y = (i * (hSrc - 1)) / hDst2;
      const yPos = Math.floor(y);
      const t = y - yPos;
      const buf1Pos = (yPos * wDst2 + j) * 4;
      const buf2Pos = (i * wDst2 + j) * 4;
      for(let k = 0; k < 4; k++) {
        const kPos = buf1Pos + k;
        const y0 =
          yPos > 0
            ? buf1[kPos - wDst2 * 4]
            : 2 * buf1[kPos] - buf1[kPos + wDst2 * 4];
        const y1 = buf1[kPos];
        const y2 = buf1[kPos + wDst2 * 4];
        const y3 =
          yPos < hSrc - 2
            ? buf1[kPos + wDst2 * 8]
            : 2 * buf1[kPos + wDst2 * 4] - buf1[kPos];

        buf2[buf2Pos + k] = interpolate(y0, y1, y2, y3, t);
      }
    }
  }
  // this._writeFile(wDst2, hDst2, buf2, "out/buf2.jpg");

  // ===========================================================
  // Pass 3 - scale to dst
  const m = wM * hM;
  if(m > 1) {
    for(let i = 0; i < hDst; i++) {
      for(let j = 0; j < wDst; j++) {
        // i&j in dst bounded coords
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;
        let realColors = 0;

        for(let y = 0; y < hM; y++) {
          const yPos = i * hM + y;

          for(let x = 0; x < wM; x++) {
            const xPos = j * wM + x;
            const xyPos = (yPos * wDst2 + xPos) * 4;
            const pixelAlpha = buf2[xyPos + 3];

            if(pixelAlpha) {
              r += buf2[xyPos];
              g += buf2[xyPos + 1];
              b += buf2[xyPos + 2];
              realColors++;
            }

            a += pixelAlpha;
          }
        }

        const pos = (i * wDst + j) * 4;
        bufDst[pos] = realColors ? Math.round(r / realColors) : 0;
        bufDst[pos + 1] = realColors ? Math.round(g / realColors) : 0;
        bufDst[pos + 2] = realColors ? Math.round(b / realColors) : 0;
        bufDst[pos + 3] = Math.round(a / m);
      }
    }
  } else {
    // replace dst buffer with buf2
    dst.buffer = buf2;
  }
}