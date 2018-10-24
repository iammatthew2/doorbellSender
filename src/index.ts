require('dotenv').config(); // {path: '/home/pi/.env'}

import { ok } from 'assert'
import { eventBus } from './eventBus';
import { constants } from './constants';
import leds from './ledHandler';
import { watchButton } from './hardware'
import { Gpio } from './types/onoff';
import logger from './logger';
import sendEvent from './sendEvent';

watchButton();

const greenLed: Gpio = leds.greenLed;

ok(process.env.TARGET_URL_BASE, 'TARGET_URL_BASE required');
const TARGET_URL_BASE = process.env.TARGET_URL_BASE;
ok(process.env.TARGET_URL_PARAMS, 'TARGET_URL_PARAMS required');
const TARGET_URL_PARAMS = process.env.TARGET_URL_PARAMS;

const targetUrl = `${TARGET_URL_BASE}${TARGET_URL_PARAMS}`;
let requestUnderWay: Boolean = false;

function fireHttpRequest() {
  requestUnderWay = true;
  leds.shortTimeOnLed(greenLed, true);
  logger.info(`firing get request to: ${targetUrl}`);
  sendEvent();
  requestUnderWay = false;
}

eventBus.on(constants.events.BUTTON_PRESSED, () => {
  if (!requestUnderWay) {
    fireHttpRequest();
  }
})

export const init = ()=> {

};


init();