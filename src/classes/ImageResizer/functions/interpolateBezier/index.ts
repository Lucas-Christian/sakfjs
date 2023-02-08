// between 2 points y(n), y(n+1), use next points out, y(n-1), y(n+2)
// to predict control points (a & b) to be placed at n+0.5
//  ya(n) = y(n) + (y(n+1)-y(n-1))/4
//  yb(n) = y(n+1) - (y(n+2)-y(n))/4
// then use std bezier to interpolate [n,n+1)
//  y(n+t) = y(n)*(1-t)^3 + 3 * ya(n)*(1-t)^2*t + 3 * yb(n)*(1-t)*t^2 + y(n+1)*t^3
//  note the 3* factor for the two control points
// for edge cases, can choose:
//  y(-1) = y(0) - 2*(y(1)-y(0))
//  y(w) = y(w-1) + 2*(y(w-1)-y(w-2))
// but can go with y(-1) = y(0) and y(w) = y(w-1)

export function interpolateBezier(x0: number, x1: number, x2: number, x3: number, t: number) {
  // x1, x2 are the knots, use x0 and x3 to calculate control points
  const cp1 = x1 + (x2 - x0) / 4;
  const cp2 = x2 - (x3 - x1) / 4;
  const nt = 1 - t;
  const c0 = x1 * nt * nt * nt;
  const c1 = 3 * cp1 * nt * nt * t;
  const c2 = 3 * cp2 * nt * t * t;
  const c3 = x2 * t * t * t;
  return Math.max(0, Math.min(255, Math.round(c0 + c1 + c2 + c3)));
};