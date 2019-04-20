/**
 * Wyrdheim-pi
 * @author mtownsend
 * @since April 2019
 */

import path from 'path';
import { play, loop } from './audio';
import { __dirname, clamp } from './util';
import { loops, triggers } from './sounds';
import InputCounter from './input-counter';

function cleanup() {
  stopTrack();
}

let stopTrack = loop(loops[0]);
new InputCounter(num => {
  const index = clamp(num, 0, loops.length - 1);
  setTimeout(stopTrack, 500); // slight delay to make the change seamless
  play(triggers[0]);
  stopTrack = loop(loops[index]);
});

process
  .on('exit', cleanup)
  .on('SIGINT', cleanup);