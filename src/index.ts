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
let requestUnderWay: Boolean;

function fireHttpRequest() {
  requestUnderWay = true;
  leds.shortTimeOnLed(greenLed);

  fetch(targetUrl, { method: 'GET' })
    .then(response => {
      if (response.status !== 200) {
        throw Error;
      } else {
        logger.info('successful button press');
      }
      requestUnderWay = false;
    })
    .catch( e => logger.error(`error firing request: ${e} to: ${targetUrl}`));
}

eventBus.on(constants.events.BUTTON_PRESSED, () => {
  if (!requestUnderWay) {
    fireHttpRequest();
  }
})

export const init = ()=> {

};


init();