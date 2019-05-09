/**
 * Wyrdheim-pi
 * @author mtownsend
 * @since April 2019
 */
 
import { BOOT_DELAY, TRIGGER_PINS, OUTPUT_PIN, COMPARTMENT_PIN, SELECTOR_PIN, DEBOUNCE_WINDOW } from './constants';
import InputCounter from './input-counter';
import PulseDecoder from './pulse-decoder';
import { connect } from './gpio';
import { setDrone, onRuneTriggered, onCompartmentTriggered, stop } from './audio-controller';
import { clamp, debounced } from './util';
import { loops } from './sounds';

const output = connect(OUTPUT_PIN, 'out');
const compartment = connect(COMPARTMENT_PIN, 'in', 'rising');
const triggers = TRIGGER_PINS.map(pin => connect(pin, 'in', 'rising'));
const selector = connect(SELECTOR_PIN, 'in', 'rising');

let phase2 = false;

function cleanup() {
  console.log('Daisy, Daisy, give me your answer do...')
  stop();
}

setDrone(0);

// Delay connecting to GPIO to ignore Arduino boot noise
setTimeout(() => {

  // Rune trigger sounds
  triggers.forEach(t => t.watch(debounced(onRuneTriggered, DEBOUNCE_WINDOW)));

  // Set up the compartment trigger sound
  compartment.watch(debounced(onCompartmentTriggered, DEBOUNCE_WINDOW));

  // Set up the drone incrementer
  new InputCounter(triggers, num => {
    setDrone(num);
    if (num >= triggers.length) {
      // Fully incremented, so signal the servo arduino
      phase2 = true;
      output.write(1);
    }
  });

  // Set up the post-rune drone selector
  new PulseDecoder(selector, index => {
    phase2 && setDrone(triggers.length + clamp(index, 1, 4) - 1);
  });

}, BOOT_DELAY);

// Make sure everything stops when the app is closed
process
  .on('exit', cleanup)
  .on('SIGINT', () => {
    process.exit(1);
  });