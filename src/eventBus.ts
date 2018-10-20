const EventEmitter = require('events');

/**
 * Use the native eventEmitter to build a little eventBus
 */
class Emitter extends EventEmitter {}
export const eventBus = new Emitter();
