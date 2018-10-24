
//az iot hub show-connection-string --hub-name chitter-iot --output table
const connectionString = 'HostName=chitter-iot.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=yop+txZgs1QO3DsNbOXN40o+QGBSygbbkhwz3y2JA74=';

const Client = require('azure-iothub').Client;

const deviceId = 'door-bell';

// Connect to the service-side endpoint on your IoT hub.
const client = Client.fromConnectionString(connectionString);

// Set the direct method name, payload, and timeout values
const methodParams = {
  methodName: 'ringDoorBell',
  payload: 10, // Number of seconds.
  responseTimeoutInSeconds: 30
};

// Call the direct method on your device using the defined parameters.
const callMethod = () => {
  client.invokeDeviceMethod(deviceId, methodParams, function (err, result) {
    if (err) {
        console.error('Failed to invoke method \'' + methodParams.methodName + '\': ' + err.message);
    } else {
        console.log('Response from ' + methodParams.methodName + ' on ' + deviceId + ':');
        console.log(JSON.stringify(result, null, 2));
    }
  });
}

export default callMethod;