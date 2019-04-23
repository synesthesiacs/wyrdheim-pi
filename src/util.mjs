/**
 * Useful miscellany 
 * @author mtownsend
 * @since April 2019
 */

import path from 'path';

/**
 * __dirname polyfill because the native behaviour doesn't work with ESM =/
 */
export const __dirname = path.dirname(new URL(import.meta.url).pathname);

/**
 * Clamps a value between two bounds
 * @param {number} num - The value to clamp
 * @param {number} min - The minimum value
 * @param {number} max - The maximum value
 * @returns {number} num clamped to [min, max] */
export function clamp(num, min, max) {
  return Math.min(max, Math.max(min, num));
}

/**
 * Ensures that a callback doesn't fire
 * more than once within a specified time window
 * @param {function} cb - The callback to debounce 
 * @param {number} window - The debounce window, in millis
 * @returns {function} The debounced callback
 */
export function debounced(cb, window) {
  let lastFire = null;
  return (...args) => {
    if (lastFire !== null && Date.now() - lastFire < window) {
      // Too soon, Executus!
      console.log('debounce');
      return;
    }
    lastFire = Date.now();
    cb(...args);
  };
}