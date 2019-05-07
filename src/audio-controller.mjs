/**
 * Audio playback and sequencing logic
 * @author mtownsend
 * @since April 2019
 */

import { MAX_PLAYER_LIFE, TIMER, MAKE_IT_BETTER } from './constants';
import { loops, rune, compartment, layer0 } from './sounds';
import { clamp } from './util';
import { loop, play } from './audio';
import ExecutionQueue from './execution-queue';

let droneIndex = null;
let stopDrone = () => {};
let playQueue = [];
let playing = false;
let droneKiller;

const queue = new ExecutionQueue(async sound => {
  if (!playing) {
    playing = true;
    stopDrone();
  }
  return play(sound);
}, () => {
  playing = false;
  restartDrone();
});

function restartDrone() {
  if (playing) { return; }

  // There's a little memory leak somewhere in the player.
  // Might be my code, might be in a library I'm using.
  // Regardless, I don't want to hunt for it so I'm just
  // going to restart the drone player every few hours. lol.
  droneKiller && clearTimeout(droneKiller);
  droneKiller = setTimeout(restartDrone, MAX_PLAYER_LIFE);

  stopDrone();
  stopDrone = loop(loops[droneIndex]);  
}

MAKE_IT_BETTER && (function queueTimer() {
  setTimeout(() => {
    queueTimer();
    queue.push(layer0);
  }, TIMER + Math.floor(Math.random() * TIMER));
})();

export function setDrone(index) {
  index = clamp(index, 0, loops.length - 1);
  if (index === droneIndex) { return; }
  droneIndex = index;
  restartDrone();
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