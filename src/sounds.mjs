/**
 * Sound provider
 * @author mtownsend
 * @since April 2019
 */
 
import path from 'path';
import { __dirname } from './util';

function resolvePath(filename) {
  return path.resolve(__dirname, '..', 'audio', filename);
}

export const loops = [
  'layer0-drone.mp3',
  'layer1.mp3',
  'layer2.mp3',
  'layer3.mp3',
  'layer-4.mp3',
  'variation5.mp3',
  'variation6.mp3',
  'variation7.mp3'
].map(resolvePath);

export const layer0 = resolvePath('layer0.mp3');
export const compartment = resolvePath('triggerA-compartment.mp3');
export const rune = resolvePath('triggerB-rune.mp3');
export const test = resolvePath('test.mp3');