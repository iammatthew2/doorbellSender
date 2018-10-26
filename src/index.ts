require('dotenv').config(); // {path: '/home/pi/.env'}

import { shortTimeOnLed, greenLed, blinkLed, killBlinkLed } from './ledHandler';
import { eventBus } from './eventBus';
import { constants } from './constants';
import { watchButton } from './buttonHandler';
import ringDoorbell from './azureIotInvoke';
import logger from './logger';
const events = constants.events;
let allowNewRequest: Boolean = true;
logger.info('doorbellSender is starting up');

export const init = () => {
  watchButton();

  eventBus.on(events.LED_SEQUENCE_COMPLETE, () => allowNewRequest = true);
  eventBus.on(events.BEGIN_REQUEST, () => allowNewRequest = false);
  eventBus.on(events.SUCCESS_REQUEST, () => {
    killBlinkLed(greenLed);
    shortTimeOnLed(greenLed);
  });

  eventBus.on(events.FAILED_REQUEST, () => {
    logger.info('FAILED_REQUEST event received - start blink for 3 sec');
    blinkLed(greenLed, 250);
    setTimeout(() => {
      killBlinkLed(greenLed);
      logger.info('Stopping blink - begin wait 3 sec until new request avail');
      setTimeout(() => {
        allowNewRequest = true;
        logger.info('new request avail');
      }, 3000);
    }, 3000);
    

  });

  eventBus.on(events.BUTTON_PRESSED, () => {
    logger.info('button pressed event fired');
    if (allowNewRequest) {
      blinkLed(greenLed, 500);
      ringDoorbell();
    }
  });
}

init();

logger.info('doorbellSender is running');