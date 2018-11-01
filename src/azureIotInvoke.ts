const assert = require('assert');
import { Client } from 'azure-iothub'
import { eventBus } from './eventBus';
import { constants } from './constants';
import track from './tracker';

const INFO = constants.logTypes.INFO;

assert(process.env.DEVICE_ID, 'DEVICE_ID required');
const deviceId = process.env.DEVICE_ID;

assert(process.env.CONNECTION_STRING, 'CONNECTION_STRING required');
const client = Client.fromConnectionString(process.env.CONNECTION_STRING);

assert(process.env.METHOD_TO_INVOKE, 'METHOD_TO_INVOKE required');

const methodParams = {
  methodName: process.env.METHOD_TO_INVOKE,
  payload: 10,
  responseTimeoutInSeconds: 30
};


const callDoorbellReceiver = () => {
  track(INFO, `Attempting to call ${methodParams.methodName}`);
  client.invokeDeviceMethod(deviceId, methodParams, function(err, result) {
    if ((result && result.status && result.status === 200) && !err)  {
      track(INFO, `here is the status: ${result.status}`)
      eventBus.emit(constants.events.SUCCESS_REQUEST);
      track(INFO, 
        `Success: ${methodParams.methodName} ${deviceId}: ${JSON.stringify(
          result,
          null,
          2
        )}`
      );
    } else {
      eventBus.emit(constants.events.FAILED_REQUEST);
      track(INFO, 
        `Rejected: ${methodParams.methodName} ${deviceId}: ${JSON.stringify(
          result,
          null,
          2
        )}`
      );
    }
  });
};

export default callDoorbellReceiver;
