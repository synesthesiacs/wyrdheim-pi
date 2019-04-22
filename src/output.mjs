/**
 * Trigger for the output signal
 * @author mtownsend
 * @since April 2019
 */

import { connect } from './gpio';
import { OUTPUT_PIN } from './constants';

const OUTPUT = connect(OUTPUT_PIN, 'out');

export function trigger() {
  OUTPUT.write(1);
}