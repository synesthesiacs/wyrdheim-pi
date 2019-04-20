/**
 * Wyrdheim-pi
 * @author mtownsend
 * @since April 2019
 */

import path from 'path';
import { play } from './audio';
import { __dirname } from './util';

const PEW = path.resolve(__dirname, '..', 'audio', 'pew.mp3');
const DRONE = path.resolve(__dirname, '..', 'audio', 'layer0-drone.mp3');

const stop = play(DRONE);

