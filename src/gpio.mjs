/**
 * GPIO abstraction to support mocking
 * @author mtownsend
 * @since April 2019
 */

import onoff from 'onoff';
import { MOCK_GPIO } from './constants';

const mockTriggers = {};

export function connect(pin, ...args) {
  if (MOCK_GPIO) {
    const { gpio, trigger } = mockGpio();
    mockTriggers[pin] = trigger;
    return gpio;
  }
  return new onoff.Gpio(pin, ...args);
}

export function triggerMock(pin) {
  mockTriggers[pin]();
}

// Mock GPIO for testing
function mockGpio() {

  let watches = [];

  const gpio = {
    watch: callback => {
      watches.push(callback); 
    },
    unwatch: callback => {
      watches = watches.filter(c => c !== callback);
    },
    write: (val, cb) => {
      console.log(`GPIO write: ${val}`);
      if (cb) {
        cb();
      }
    }
  };

  return {
    gpio,
    trigger: () => watches.forEach(cb => cb.call(gpio))
  };

}