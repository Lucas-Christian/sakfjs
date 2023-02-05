export function clampTo8bit(a) {
  return a < 0 ? 0 : a > 255 ? 255 : a;
}