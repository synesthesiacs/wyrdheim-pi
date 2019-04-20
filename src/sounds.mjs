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
  'layer4.mp3'
].map(resolvePath);

export const triggers = [
  'triggerA-compartment.mp3',
  'triggerB-rune.mp3'
].map(resolvePath);