import { safeGpio } from './hardware'
import { constants } from './constants';
import { Gpio } from 'onoff';
import logger from './logger';

const ledPin = constants.pins.led;
const ON: number = 1;
const OFF: number = 0;

export const greenLed: Gpio = safeGpio(ledPin, 'out');

const shortTimeOnLed = (led: Gpio, setTimer?: Boolean) => {
  logger.info('start shortTimeOnLed fired - turn led on');
  led.writeSync(ON);
  if (setTimer) {
    setTimeout(() => {
      logger.info('stop shortTimeOnLed - shortTimeOnLed setTimeout called.');
      led.writeSync(OFF);
    }, 3000);
  }
}

let ledHandler;

logger.info('init the ledHandler');

export default ledHandler = {
  greenLed,
  shortTimeOnLed,
  OFF,
  ON,
}