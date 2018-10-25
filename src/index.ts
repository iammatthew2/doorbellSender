require('dotenv').config(); // {path: '/home/pi/.env'}

import { shortTimeOnLed, greenLed } from './ledHandler';
import { eventBus } from './eventBus';
import { constants } from './constants';
import { watchButton } from './buttonHandler';
import sendEvent from './sendEvent';
import logger from './logger';
const events = constants.events;

logger.info('doorbellSender is starting up');

export const init = () => {
  watchButton();

  let allowNewRequest: Boolean = true;
  
  eventBus.on(events.LED_TURNED_OFF, () => allowNewRequest = true);

  eventBus.on(events.BEGIN_REQUEST, () => allowNewRequest = false);

  eventBus.on(events.SUCCESS_REQUEST, () => shortTimeOnLed(greenLed, true));

  eventBus.on(events.BUTTON_PRESSED, () => {
    logger.info('button pressed event fired');
    if (allowNewRequest) {
      sendEvent();
    }
  });
}

init();
logger.info('doorbellSender is running');