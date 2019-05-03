/**
 * Wyrdheim-pi
 * @author mtownsend
 * @since April 2019
 */
 
import { TRIGGER_PINS, OUTPUT_PIN, COMPARTMENT_PIN, SELECTOR_PIN, NUM_DRONES, DEBOUNCE_WINDOW } from './constants';
import InputCounter from './input-counter';
import PulseDecoder from './pulse-decoder';
import { connect } from './gpio';
import { setDrone, onRuneTriggered, onCompartmentTriggered, stop } from './audio-controller';
import { debounced } from './util';

const output = connect(OUTPUT_PIN, 'out');
const compartment = connect(COMPARTMENT_PIN, 'in', 'rising');
const triggers = TRIGGER_PINS.map(pin => connect(pin, 'in', 'rising'));
const selector = connect(SELECTOR_PIN, 'in', 'rising');

function cleanup() {
  console.log('Daisy, Daisy, give me your answer do...')
  stop();
}

// Rune trigger sounds
triggers.forEach(t => t.watch(debounced(onRuneTriggered, DEBOUNCE_WINDOW)));

// Set up the compartment trigger sound
compartment.watch(debounced(onCompartmentTriggered, DEBOUNCE_WINDOW));

// Set up the drone incrementer
setDrone(0);
new InputCounter(triggers, num => {
  setDrone(num);
  if (num >= NUM_DRONES - 1) {
    // Fully incremented, so signal the servo arduino
    output.write(1);
  }
});

// Set up the post-rune drone selector
new PulseDecoder(selector, index => {
  console.log(`Select drone ${index}.`); // TODO
});

// Make sure everything stops when the app is closed
process
  .on('exit', cleanup)
  .on('SIGINT', () => {
    process.exit(1);
  });