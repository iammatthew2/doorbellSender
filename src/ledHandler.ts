import { safeGpio } from './hardware'
import { constants } from './constants';
import { Gpio } from 'onoff';
import logger from './logger';


let blinkingLed;
const blinkInterval = 500;
const ledPin = constants.pins.led;
const ON: number = 1;
const OFF: number = 0;

export const greenLed: Gpio = safeGpio(ledPin, 'out');

const toggleLed = (led: Gpio, forceState?: number) =>{
  if (forceState) {
    led.writeSync(forceState);
  } else {
    led.writeSync(led.readSync() ^ 1);
  }
}

const startBlinkingLed = (led: Gpio) => {
  // logger.info('startBlinkingLed');
  // blinkingLed = setInterval(() => toggleLed(greenLed), blinkInterval);
}

const stopBlinkingLed = (led: Gpio) => {
  // logger.info('stopBlinkingLed');
  // toggleLed(greenLed, OFF);
  // clearInterval(blinkingLed);
}

const shortTimeOnLed = (led: Gpio) => {
  logger.info('start shortTimeOnLed fired');
  toggleLed(greenLed, ON);
  setTimeout(() => {
    logger.info('stop shortTimeOnLed - shortTimeOnLed setTimeout called.');
    toggleLed(greenLed, OFF);
  }, 5000)
}

let ledHandler;

logger.info('init the ledHandler');

export default ledHandler = {
  greenLed,
  shortTimeOnLed,
  startBlinkingLed,
  stopBlinkingLed,
}