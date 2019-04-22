/**
 * Useful miscellany 
 * @author mtownsend
 * @since April 2019
 */

import path from 'path';

export const __dirname = path.dirname(new URL(import.meta.url).pathname);

export function clamp(num, min, max) {
  return Math.min(max, Math.max(min, num));
}