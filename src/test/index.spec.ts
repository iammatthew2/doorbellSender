
import { init } from '../index';
import { eventBus } from '../eventBus';
import { expect } from 'chai';
import { constants } from'../constants';
import leds from '../ledHandler';
import nock = require('nock');
import { Gpio } from 'onoff';
import { readSync } from 'fs';
import sinon = require('sinon');


describe('basic app operability', () => {  
  beforeEach(function() {
    nock(process.env.TARGET_URL_BASE)
    .get(process.env.TARGET_URL_PARAMS)
    .reply(200);
  });

  init();

  const eventConfirm = (cb, complete?) => {
    cb();
    complete();
  }

  it('should fire an http request on button press event', done => {
    eventBus.emit(constants.events.BUTTON_PRESSED);
    eventBus.on(constants.events.SUCCESS_GET_REQUEST, eventConfirm(done));
    eventBus.removeListener(constants.events.SUCCESS_GET_REQUEST, eventConfirm(done)); 
  });

  it('should have a valid led', () => {
    expect(leds.greenLed.readSync).to.be.ok;
  })

  it('should blink LED while http request is pending', done => {
    const blinkStartSpy = sinon.spy(leds, 'startBlinkingLed');
    const blinkStopSpy = sinon.spy(leds, 'stopBlinkingLed');
    expect(blinkStartSpy.calledOnce).to.be.false;
    expect(blinkStopSpy.calledOnce).to.be.false;

    eventBus.emit(constants.events.BUTTON_PRESSED);
    expect(blinkStartSpy.calledOnce).to.be.true;
    eventConfirm(done, () => {    
      expect(blinkStopSpy.calledOnce).to.be.true;
    })
  })
});

