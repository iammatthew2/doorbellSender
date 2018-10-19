import { safeGpio } from './hardware'
import { constants } from './constants';
import { Gpio } from 'onoff';

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
  blinkingLed = setInterval(() => toggleLed(greenLed), blinkInterval);
}

const stopBlinkingLed = (led: Gpio) => {
  toggleLed(greenLed, OFF);
  clearInterval(blinkingLed);
}

const shortTimeOnLed = (led: Gpio) => {
  toggleLed(greenLed, ON);
  setTimeout(() => toggleLed(greenLed, OFF), 5000)
}

let ledHandler;

export default ledHandler = {
  greenLed,
  shortTimeOnLed,
  startBlinkingLed,
  stopBlinkingLed,
}