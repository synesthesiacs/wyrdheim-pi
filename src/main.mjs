/**
 * Wyrdheim-pi
 * @author mtownsend
 * @since April 2019
 */

import path from 'path';
import { play, loop } from './audio';
import { __dirname, clamp } from './util';
import { loops, rune, compartment } from './sounds';
import InputCounter from './input-counter';
import { trigger } from './output';

function cleanup() {
  stopTrack();
}

let stopTrack = loop(loops[0]);
new InputCounter(async num => {
  const index = clamp(num, 0, loops.length - 1);
  setTimeout(stopTrack, 500); // slight delay to make the change seamless
  await play(rune);
  stopTrack = loop(loops[index]);
  if (num >= loops.length - 1) {
    trigger();
  }
});

process
  .on('exit', cleanup)
  .on('SIGINT', cleanup);