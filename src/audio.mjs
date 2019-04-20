/**
 * Simple audio interface for looping mp3 files
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

function startPlayer(absolutePath) {
  // We're forking the player here because of this bug
  // https://github.com/TooTallNate/node-speaker/issues/92
  const player = fork(PLAYER);
  player.send({
    type: 'play',
    path: absolutePath
  });
  return player;
}

export function play(absolutePath) {

  let player;
  const loop = () => {
    player = startPlayer(absolutePath);
    player.on('message', ({ type }) => {
      if (type === 'end') loop();
    });
  };
  loop();

  return () => {
    player.off('exit', loop);
    player.send({ type: 'stop' }); 
  };
}