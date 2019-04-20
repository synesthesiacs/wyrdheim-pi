import path from 'path';

export const __dirname = path.dirname(new URL(import.meta.url).pathname);

export function clamp(num, min, max) {
  return Math.min(max, Math.max(min, num));
}