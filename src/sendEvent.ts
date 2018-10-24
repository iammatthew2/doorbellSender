const Client = require('azure-iothub').Client;
const assert = require('assert');
import logger from './logger';

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
  client.invokeDeviceMethod(deviceId, methodParams, function(err, result) {
    if (err) {
      logger.error(
        `Failed to invoke method ${methodParams.methodName} - err: ${
          err.message
        }`
      );
    } else {
      logger.info(
        `Response: ${methodParams.methodName} ${deviceId}: ${JSON.stringify(
          result,
          null,
          2
        )}`
      );
    }
  });
};

export default callMethod;
