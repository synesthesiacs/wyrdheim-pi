/**
 * Wyrdheim-pi
 * @author mtownsend
 * @since April 2019
 */

import path from 'path';
import { play } from './audio';
import { __dirname, clamp } from './util';
import loops from './loops';
import InputCounter from './input-counter';

function cleanup() {
  stopTrack();
}

let stopTrack = play(loops[0]);
new InputCounter(num => {
  const index = clamp(num, 0, loops.length - 1);
  setTimeout(stopTrack, 500);
  stopTrack = play(loops[index]);
});

process
  .on('exit', cleanup)
  .on('SIGINT', cleanup);