/**
 * Wyrdheim-pi
 * @author mtownsend
 * @since April 2019
 */

import InputCounter from './input-counter';
import { connect, triggerMock } from './gpio';
import { OUTPUT_PIN, COMPARTMENT_PIN, NUM_DRONES } from './constants';
import { setDrone, onRuneTriggered, onCompartmentTriggered, stop } from './audio-controller';

const OUTPUT = connect(OUTPUT_PIN, 'out');
const COMPARTMENT = connect(COMPARTMENT_PIN, 'in', 'rising');

function cleanup() {
  stop();
}

// Set up the incrementing drone loops
setDrone(0);
new InputCounter(async num => {
  onRuneTriggered();
  setDrone(num);
  if (num >= NUM_DRONES - 1) {
    // Fully incremented, so signal the servo arduino
    OUTPUT.write(1);
  }
});

// Set up the compartment trigger sound
COMPARTMENT.watch(onCompartmentTriggered);

// setTimeout(() => triggerMock(COMPARTMENT_PIN), 3000);

// Make sure everything stops when the app is closed
process
  .on('exit', cleanup)
  .on('SIGINT', cleanup);