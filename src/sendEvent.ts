const Client = require('azure-iothub').Client;
const assert = require('assert');
import logger from './logger';
import { eventBus } from './eventBus';
import { constants } from './constants';

assert(process.env.DEVICE_ID, 'DEVICE_ID required');
const deviceId = process.env.DEVICE_ID;

assert(process.env.CONNECTION_STRING, 'CONNECTION_STRING required');
const client = Client.fromConnectionString(process.env.CONNECTION_STRING);

const methodParams = {
  methodName: 'ringDoorBell',
  payload: 10,
  responseTimeoutInSeconds: 30
};

const callMethod = () => {
  logger.info(`Attempting to call ${methodParams.methodName}`);
  client.invokeDeviceMethod(deviceId, methodParams, function(err, result) {
    eventBus.emit(constants.events.BEGIN_REQUEST);
    if (err) {
      logger.error(
        `Failed to invoke method ${methodParams.methodName} - err: ${
          err.message
        }`
      );
    } else {
      eventBus.emit(constants.events.SUCCESS_REQUEST);
      logger.info(
        `Success: ${methodParams.methodName} ${deviceId}: ${JSON.stringify(
          result,
          null,
          2
        )}`
      );
    }
  });
};

export default callMethod;
