import { Gpio, Direction } from 'onoff';
import { eventBus } from './eventBus';
import { constants } from './constants';

function safeGpio(gpio: number, direction: Direction, edge?: String, options?: Object): Gpio {
  if (Gpio.accessable) {
    return new Gpio(gpio, direction, edge, options );
  } else {
    // @ts-ignore
    return {
      watch: (cb) => {}
    }
  }
}

function init () {
  const button = safeGpio(4, 'in', 'both', { debounceTimeout: 100 });

  button.watch((err, value) => {
    if (err) {
      throw err;
    }
    eventBus.emit(constants.events);
  });

  process.on('SIGINT', () => {
    button.unexport();
  });

};

function getPinState(pin: number): String {
  return "someState"
}

function toggleLed(pin: number, delay?: Number) {

  const state = getPinState(pin);

  if (state === 'in') {
    safeGpio(pin, 'out', undefined);
  } else {
    safeGpio(pin, 'in');

  }
}

init();

module.exports = { toggleLed }