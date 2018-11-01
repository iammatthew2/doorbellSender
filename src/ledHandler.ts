import { safeGpio } from './safeGpio';
import { constants } from './constants';
import { Gpio } from 'onoff';
import logger from './logger';
import { eventBus } from './eventBus';

const ledPin = constants.pins.led;
const ON: number = 1;
const OFF: number = 0;

let blinkLedTimer: NodeJS.Timeout;

export const greenLed: Gpio = safeGpio(ledPin, 'out');

export const blinkLed = (led: Gpio, rate: number) => {
  killBlinkLed(led);
  blinkLedTimer = setInterval(() => {
    led.writeSync(led.readSync()^1);
  }, rate);
}

export const killBlinkLed = (led: Gpio) => {
  logger.info('killing blinking');

  clearInterval(blinkLedTimer);
  led.writeSync(OFF);
  logger.info('it was killed');

}

export const shortTimeOnLed = (led: Gpio, duration: number) => {
  logger.info('start shortTimeOnLed fired - turn led on');
  led.writeSync(ON);
  setTimeout(() => {
    logger.info('stop shortTimeOnLed - shortTimeOnLed setTimeout called.');
    led.writeSync(OFF);
    eventBus.emit(constants.events.LED_SEQUENCE_COMPLETE);
  }, duration);
}

logger.info('ledHandler is running');
