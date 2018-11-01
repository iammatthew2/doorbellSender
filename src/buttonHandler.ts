import { safeGpio } from './safeGpio';
import { eventBus } from './eventBus';
import { constants } from './constants';
import logger from './logger';

let throttleOpen:Boolean = true;

function resetThrottle() {
  throttleOpen = false;
  setTimeout(() => {
    throttleOpen = true;
  }, 1000)
}
/**
 * start the button watcher
 */
export const watchButton = () => {
  const button = safeGpio(constants.pins.button, 'in', 'both', {
    debounceTimeout: 250
  });

  logger.info(`button.watch: start watcher`);

  button.watch((err, value) => {
    if (err) {
      logger.error(`button.watch err: ${err}`);
      throw err;
    }
    logger.info(`button.watch: firing ${constants.events.BUTTON_PRESSED}`);
    if (throttleOpen) {
      resetThrottle();
      eventBus.emit(constants.events.BUTTON_PRESSED);
    }
  });

  process.on('SIGINT', () => {
    button.unexport();
  });
};


