import onoff from 'onoff';
import GpioMock from './gpio-mock';

const INPUT_PINS = [ 5, 6, 13, 19 ].map(makeGpio);

function makeGpio(pin) {
  try {
    return new onoff.Gpio(p, 'in', 'rising');
  }
  catch {
    // Can't GPIO, so mock it for testing
    return new GpioMock(pin * 1500);
  }
}

export default function InputCounter(changeHandler) {

  let count = 0;
  function increment() {
    changeHandler(++count);
    this.unwatch(increment);
  };

  INPUT_PINS.forEach(p => p.watch(increment));
}

