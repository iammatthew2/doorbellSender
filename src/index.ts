require('dotenv').config(); // {path: '/home/pi/.env'}

import { shortTimeOnLed, greenLed } from './ledHandler';
import { eventBus } from './eventBus';
import { constants } from './constants';
import { watchButton } from './buttonHandler';
import ringDoorbell from './azureIotInvoke';
import track from './tracker';

const events = constants.events;
const INFO = constants.logTypes.INFO;

let allowNewRequest: Boolean = true;

track(INFO, 'doorbellSender is starting up');

export const init = () => {
  watchButton();

  eventBus.on(events.LED_SEQUENCE_COMPLETE, () => allowNewRequest = true);
  eventBus.on(events.SUCCESS_REQUEST, () => {
    shortTimeOnLed(greenLed, 3000);
  });

  eventBus.on(events.FAILED_REQUEST, () => {
    track(INFO, 'FAILED_REQUEST event received - led on for 300ms');
    shortTimeOnLed(greenLed, 100);
    setTimeout(() => {
      allowNewRequest = true;
      track(INFO, 'new request avail now that 6sec has passed');
    }, 6000);
  });

  eventBus.on(events.BUTTON_PRESSED, () => {
    track(INFO, 'button pressed event fired');
    if (allowNewRequest) {
      allowNewRequest = false;
      ringDoorbell();
    }
  });
}

init();

track(INFO, 'doorbellSender is running');