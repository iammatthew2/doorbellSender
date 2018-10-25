import { safeGpio } from './safeGpio';
import { constants } from './constants';
import { Gpio } from 'onoff';
import logger from './logger';
import { eventBus } from './eventBus';


const ledPin = constants.pins.led;
const ON: number = 1;
const OFF: number = 0;

export const greenLed: Gpio = safeGpio(ledPin, 'out');

export const shortTimeOnLed = (led: Gpio, setTimer?: Boolean) => {
  logger.info('start shortTimeOnLed fired - turn led on');
  led.writeSync(ON);
  if (setTimer) {
    setTimeout(() => {
      logger.info('stop shortTimeOnLed - shortTimeOnLed setTimeout called.');
      led.writeSync(OFF);
      eventBus.emit(constants.events.LED_TURNED_OFF);
    }, 3000);
  }
}

logger.info('ledHandler is running');
