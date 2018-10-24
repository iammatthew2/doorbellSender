require('dotenv').config({path: '/home/pi/.env'});
import { eventBus } from './eventBus';
import { constants } from './constants';
import leds from './ledHandler';
import { watchButton } from './hardware'
import fetch from 'node-fetch';
import { Gpio } from './types/onoff';
import logger from './logger';
import sendEvent from './sendEvent';

watchButton();

const greenLed: Gpio = leds.greenLed;


// i moved this urls out of .env becuase of context issues. Prob good now.
const TARGET_URL_BASE = 'https://funcappwin.azurewebsites.net';
const TARGET_URL_PARAMS = '/api/DoorBell-HttpTrigger?code=oSla/iXCyVJVdhpbUWhcbzZUHRa65pBCaeWDWnz7ViMYNh6cMJoEoQ==&name=backGate';

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