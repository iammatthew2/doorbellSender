import { Gpio, Direction} from 'onoff';
import { eventBus } from './eventBus';
import { constants } from './constants';

export const safeGpio = (gpio: number, direction: Direction, edge?: String, options?: Object): Gpio => {
  if (Gpio.accessable) {
    return new Gpio(gpio, direction, edge, options );
  } else {
    // @ts-ignore
    return {
      watch: (cb) => {},
      readSync: () => {return 1},
      writeSync: () => {}
    }
  }
}

/**
 * start the button watcher
 */
function init () {
  const button = safeGpio(constants.pins.button, 'in', 'both', { debounceTimeout: 100 });

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

init();
