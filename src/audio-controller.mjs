/**
 * Audio playback and sequencing logic
 * @author mtownsend
 * @since April 2019
 */

import { NUM_DRONES } from './constants';
import { loops, rune, compartment, test } from './sounds';
import { clamp } from './util';
import { loop, play } from './audio';
import ExecutionQueue from './execution-queue';

let droneIndex = null;
let stopDrone = () => {};
let playQueue = [];
let playing = false;

const queue = new ExecutionQueue(async sound => {
  if (!playing) {
    playing = true;
    setTimeout(stopDrone, 500);
  }
  return play(sound);
}, () => {
  playing = false;
  stopDrone = loop(loops[droneIndex]);
});

export function setDrone(index) {
  index = clamp(index, 0, NUM_DRONES - 1);
  if (index === droneIndex) { return; }
  droneIndex = index;
  if (!playing) {
    setTimeout(stopDrone, 500);
    stopDrone = loop(loops[index]);
  }
}

export async function onRuneTriggered() {
  queue.push(rune);
}

export function onCompartmentTriggered() {
  queue.push(compartment);
}

export function stop() {
  stopDrone();
}