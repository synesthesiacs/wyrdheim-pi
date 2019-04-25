/**
 * Increments an internal value and notifies watchers
 * whenever a pin is triggered
 * @author mtownsend
 * @since April 2019 
 */

export default function InputCounter(inputs, changeHandler) {
  let count = 0;
  inputs.forEach(p => {
    p.watch(function increment() {
      changeHandler(++count);
      p.unwatch(increment);
    });
  });
}

