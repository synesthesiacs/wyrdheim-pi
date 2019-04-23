/**
 * Increments an internal value and notifies watchers
 * whenever a pin is triggered
 * @author mtownsend
 * @since April 2019 
 */

import { connect } from './gpio';
import { TRIGGER_PINS } from './constants';

const INPUTS = TRIGGER_PINS.map(pin => connect(pin, 'in', 'rising'));

export default function InputCounter(changeHandler) {
  let count = 0;
  INPUTS.forEach(p => {
    p.watch(function increment() {
      changeHandler(++count);
      p.unwatch(increment);
    });
  });
}

