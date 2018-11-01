const Client = require('azure-iothub').Client;
const assert = require('assert');
import logger from './logger';
import { eventBus } from './eventBus';
import { constants } from './constants';

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

const successOptions:Array<number> = [200, 201, 202];

const callDoorbellReceiver = () => {
  logger.info(`Attempting to call ${methodParams.methodName}`);
  client.invokeDeviceMethod(deviceId, methodParams, function(err, result) {
    if ((result && result.status && result.status === 200) && !err)  {
      logger.info(`here is the status: ${result.status}`)
      eventBus.emit(constants.events.SUCCESS_REQUEST);
      logger.info(
        `Success: ${methodParams.methodName} ${deviceId}: ${JSON.stringify(
          result,
          null,
          2
        )}`
      );
    } else {
      eventBus.emit(constants.events.FAILED_REQUEST);
      logger.info(
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
