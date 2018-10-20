require('dotenv').config();
import { eventBus } from './eventBus';
import { constants } from './constants';
import leds from './ledHandler';
import { watchButton } from './hardware'
import fetch from 'node-fetch';
import { Gpio } from './types/onoff';
import logger from './logger';

watchButton();

const greenLed: Gpio = leds.greenLed;
const targetUrl = `${process.env.TARGET_URL_BASE}${process.env.TARGET_URL_PARAMS}`;
  
function fireHttpRequest() {
  leds.startBlinkingLed(greenLed);
  fetch(targetUrl, { method: 'GET' })
    .then(response => {
      leds.stopBlinkingLed(greenLed);
      if (response.status !== 200) {
        throw Error;
      } else {
        logger.info('successful button press');
        leds.shortTimeOnLed(greenLed);
        eventBus.emit(constants.events.SUCCESS_GET_REQUEST);
      }
    })
    .catch( e => logger.error(`error firing request: ${e} to: ${targetUrl}`));
}

eventBus.on(constants.events.SUCCESS_GET_REQUEST, () => {
  logger.info('successful button press');
  leds.shortTimeOnLed(greenLed);
});

export const init = ()=> {
  eventBus.on(constants.events.BUTTON_PRESSED, () => {
    fireHttpRequest();
  })
};

init();