/** 
 * Converts pulses on an input line into an integer 
 * This is easier than a binary decoder and we only
 * care about 1-4, so that'd be overkill.
 * @author mtownsend
 * @since April 2019
 */

import { DEBOUNCE_WINDOW, PULSE_BUFFER } from './constants.mjs';
import { debounced } from './util.mjs';

export default function PulseDecoder(input, signalHandler) {

  let decodeTimer = null;
  let count = 0;

  input.watch(debounced(() => {
    decodeTimer && clearTimeout(decodeTimer);
    decodeTimer = setTimeout(() => {
      signalHandler(count);
      count = 0;
    }, PULSE_BUFFER);
    count++;
  }, DEBOUNCE_WINDOW));
  
}