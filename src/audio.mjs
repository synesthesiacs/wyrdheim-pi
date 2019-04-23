/**
 * Simple audio interface for playing mp3 files
 * @author mtownsend
 * @since April 2019
 */

import fs from 'fs';
import path from 'path';
import lame from 'lame';
import { fork } from 'child_process';
import Speaker from 'speaker';
import { __dirname } from './util';

const PLAYER = path.resolve(__dirname, 'player.js');

function startPlayer(absolutePath, loop = false) {
  // We're forking the player here because of this bug
  // https://github.com/TooTallNate/node-speaker/issues/92
  const player = fork(PLAYER);
  player.send({
    type: 'play',
    path: absolutePath,
    loop
  });
  return player;
}

export function loop(absolutePath) {
  const player = startPlayer(absolutePath, true);
  return () => {
    if (player.connected) {
      player.send({ type: 'stop' }); 
    }
  };
}

export function play(absolutePath) {
  return new Promise(resolve => {
    const player = startPlayer(absolutePath);
    player.on('message', ({ type }) => {
      if (type === 'end') resolve();
    });
  });
}