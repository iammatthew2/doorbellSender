
import { init } from '../index';
import { eventBus } from '../eventBus';
import { expect } from 'chai';
import { constants } from'../constants';
import { greenLed } from '../ledHandler';

describe('basic app operability', () => {  
  init();
  const eventConfirm = (cb, complete?) => {
    cb();
    complete();
  }

  it('should fire an http request on button press event', done => {
    eventBus.emit(constants.events.BUTTON_PRESSED);
    eventBus.on(constants.events.SUCCESS_REQUEST, eventConfirm(done));
    eventBus.removeListener(constants.events.SUCCESS_REQUEST, eventConfirm(done)); 
  });

  it('should have a valid led', () => {
    expect(greenLed.readSync).to.be.ok;
  });
});