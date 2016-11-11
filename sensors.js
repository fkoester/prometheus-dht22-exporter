const gpio = require('pi-gpio');
const client = require('prom-client');
const Promise = require('bluebird');

Promise.promisifyAll(gpio);

const sensors = [{
  gpioPin: 11,
  sensorId: '0',
  sensorDescription: '',
}, {
  gpioPin: 12,
  sensorId: '1',
  sensorDescription: '',
}, {
  gpioPin: 13,
  sensorId: '2',
  sensorDescription: '',
}, {
  gpioPin: 15,
  sensorId: '3',
  sensorDescription: '',
}, {
  gpioPin: 16,
  sensorId: '4',
  sensorDescription: '',
}, {
  gpioPin: 18,
  sensorId: '5',
  sensorDescription: '',
}];

const airTempGauge = new client.Gauge('air_temperature', 'Air Temperature in a room', ['sensorId', 'sensorDescription']);
const relHumidityGauge = new client.Gauge('humidity_relative', 'Relative humidity in a room', ['sensorId', 'sensorDescription']);

function readSensorData(sensor) {
  gpio.readAsync(sensor.gpioPin)
  .then((value) => {
    console.log(`${sensorId} ${value}`);
    //tempGauge.set(parseFloat(data));
  });
}

Promise.map(sensors, (sensor) => {
  return gpio.openAsync(sensor.gpioPin, 'input');
})
.then(Promise.map(sensors, (sensor) => {
  return readSensorData(sensor);
});
