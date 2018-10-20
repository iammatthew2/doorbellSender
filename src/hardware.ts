import { Gpio, Direction} from 'onoff';
import { eventBus } from './eventBus';
import { constants } from './constants';
import logger from './logger';

/**
 * start the button watcher
 */
export const watchButton = () => {
  const button = safeGpio(constants.pins.button, 'in', 'both', { debounceTimeout: 500 });

  logger.info(`button.watch: start watcher`);

  button.watch((err, value) => {
    if (err) {
      logger.error(`button.watch err: ${err}`);
      throw err;
    }
    logger.info(`button.watch: firing ${constants.events.BUTTON_PRESSED}`);
    eventBus.emit(constants.events.BUTTON_PRESSED);
  });

  process.on('SIGINT', () => {
    button.unexport();
  });

};
export const safeGpio = (gpio: number, direction: Direction, edge?: String, options?: Object): Gpio => {
  if (true || Gpio.accessable) {
    logger.info(`Gpio is available. Setting up pin: ${gpio}`);

    return new Gpio(gpio, direction, edge, options );
  } else {
    // @ts-ignore
    return {
      watch: (cb) => {
        setInterval(() => {
          logger.info('keep app alive');
        }, 100000);

      },
      unexport: () => {},
      readSync: () => {return 1},
      writeSync: () => {}
    }
  }
}
