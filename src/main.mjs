/**
 * Wyrdheim-pi
 * @author mtownsend
 * @since April 2019
 */

import InputCounter from './input-counter';
import { connect } from './gpio';
import { TRIGGER_PINS, OUTPUT_PIN, COMPARTMENT_PIN, NUM_DRONES, DEBOUNCE_WINDOW } from './constants';
import { setDrone, onRuneTriggered, onCompartmentTriggered, stop } from './audio-controller';
import { debounced } from './util';

const OUTPUT = connect(OUTPUT_PIN, 'out');
const COMPARTMENT = connect(COMPARTMENT_PIN, 'in', 'rising');
const TRIGGERS = TRIGGER_PINS.map(pin => connect(pin, 'in', 'rising'));

function cleanup() {
  console.log('Daisy, Daisy, give me your answer do...')
  stop();
}

// Rune trigger sounds
TRIGGERS.forEach(t => t.watch(debounced(onRuneTriggered, DEBOUNCE_WINDOW)));

// Set up the compartment trigger sound
COMPARTMENT.watch(debounced(onCompartmentTriggered, DEBOUNCE_WINDOW));

// Set up the drone incrementer
setDrone(0);
new InputCounter(TRIGGERS, async num => {
  setDrone(num);
  if (num >= NUM_DRONES - 1) {
    // Fully incremented, so signal the servo arduino
    OUTPUT.write(1);
  }
});

// Make sure everything stops when the app is closed
process
  .on('exit', cleanup)
  .on('SIGINT', () => {
    process.exit(1);
  });