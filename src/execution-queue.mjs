/**
 * Manages sequential execution on a series of queued values
 * @author mtownsend
 * @since April 2019
 */

export default class ExecutionQueue {

  async __executeQueue() {

    const val = this.__queue.shift();
    if (!val) { 
      // Queue is empty now!
      this.__executing = false;
      this.__onQueueEmptied();
      return; 
    }

    this.__executing = true;
    const ret = this.__execute(val);
    if (ret.then) {
      // This is a Promise, so execute is asynchronous
      // Wait for it to finish
      await ret;
    }

    // Keep going until the queue is empty
    this.__executeQueue();
  }

  constructor(execute, onQueueEmptied = () => {}) {
    this.__execute = execute;
    this.__onQueueEmptied = onQueueEmptied;
    this.__queue = [];
  }

  push(val) {
    this.__queue.push(val);
    if (!this.__executing) {
      this.__executeQueue();
    }
  }
}