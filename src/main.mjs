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
import { connect, triggerMock } from './gpio';
import { OUTPUT_PIN, COMPARTMENT_PIN } from './constants';

const OUTPUT = connect(OUTPUT_PIN, 'out');
const COMPARTMENT = connect(COMPARTMENT_PIN, 'in', 'rising');

function cleanup() {
  stopTrack();
}

// Set up the incrementing drone loops
let currentIndex = 0;
let stopTrack = loop(loops[currentIndex]);
new InputCounter(async num => {
  const index = currentIndex = clamp(num, 0, loops.length - 1);
  setTimeout(stopTrack, 500); // slight delay to make the change seamless
  await play(rune);
  if (index !== currentIndex) {
    // Two increments happened in quick succession, and this one 
    // is now obsolete.
    return;
  }
  stopTrack = loop(loops[index]);
  if (num >= loops.length - 1) {
    // Fully incremented, so signal the servo arduino
    OUTPUT.write(1);
  }
});

// Set up the compartment trigger sound
COMPARTMENT.watch(() => {
  play(compartment);
});

// TODO: Remove this stuff before merging //
setTimeout(() => { triggerMock(13); }, 3000);
setTimeout(() => { triggerMock(5); }, 4000);
//////

process
  .on('exit', cleanup)
  .on('SIGINT', cleanup);