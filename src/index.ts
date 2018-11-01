require('dotenv').config(); // {path: '/home/pi/.env'}

import { shortTimeOnLed, greenLed } from './ledHandler';
import { eventBus } from './eventBus';
import { constants } from './constants';
import { watchButton } from './buttonHandler';
import ringDoorbell from './azureIotInvoke';
import logger from './logger';
const events = constants.events;
let allowNewRequest: Boolean = true;
logger.info('doorbellSender is starting up');


// assert(process.env.AZURE_IOT_CONNECTION_STRING, 'AZURE_IOT_CONNECTION_STRING required');
// const client = Client.fromConnectionString(process.env.AZURE_IOT_CONNECTION_STRING, Mqtt);

const appInsights = require("applicationinsights");
appInsights.setup("a25e339a-81f8-484e-876a-361a225f19ce");
appInsights.start();




export const init = () => {
  watchButton();

  eventBus.on(events.LED_SEQUENCE_COMPLETE, () => allowNewRequest = true);
  eventBus.on(events.SUCCESS_REQUEST, () => {
    shortTimeOnLed(greenLed, 3000);
  });

  eventBus.on(events.FAILED_REQUEST, () => {
    logger.info('FAILED_REQUEST event received - led on for 300ms');
    shortTimeOnLed(greenLed, 100);
    setTimeout(() => {
      allowNewRequest = true;
      logger.info('new request avail now that 6sec has passed');
    }, 6000);
  });

  eventBus.on(events.BUTTON_PRESSED, () => {
    logger.info('button pressed event fired');
    if (allowNewRequest) {
      allowNewRequest = false;
      ringDoorbell();
    }
  });
}

init();

logger.info('doorbellSender is running');