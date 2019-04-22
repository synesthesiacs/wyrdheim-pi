import onoff from 'onoff';
import { MOCK_GPIO } from './constants';

export function connect(pin, ...args) {
  if (MOCK_GPIO) {
    return new GpioMock(pin * 1500);
    
  }
  return new onoff.Gpio(pin, ...args);
}

// Mock GPIO for testing
function GpioMock(triggerInterval = 1000) {
  let watches = [];

  this.watch = function(callback) {
    watches.push(callback); 
  };

  this.unwatch = function(callback) {
    watches = watches.filter(c => c !== callback);
  };

  this.write = function(val, cb) {
    console.log(`GPIO write: ${val}`);
    cb();
  }

  setInterval(() => {
    watches.forEach(cb => cb.call(this));
  }, triggerInterval);
}