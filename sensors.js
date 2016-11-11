const gpio = require('pi-gpio');
const client = require('prom-client');
const Promise = require('bluebird');

Promise.promisifyAll(gpio);

const sensors = [{
  gpioPin: 11,
  id: '0',
  description: '',
}, {
  gpioPin: 12,
  id: '1',
  description: '',
}, {
  gpioPin: 13,
  id: '2',
  description: '',
}, {
  gpioPin: 15,
  id: '3',
  description: '',
}, {
  gpioPin: 16,
  id: '4',
  description: '',
}, {
  gpioPin: 18,
  id: '5',
  description: '',
}];

const airTempGauge = new client.Gauge('air_temperature', 'Air Temperature in a room', ['sensorId', 'sensorDescription']);
const relHumidityGauge = new client.Gauge('humidity_relative', 'Relative humidity in a room', ['sensorId', 'sensorDescription']);

function readSensorData(sensor) {
  gpio.readAsync(sensor.gpioPin)
  .then((value) => {
    console.log(`${sensor.id} ${value}`);
    // tempGauge.set(parseFloat(data));
  });
}

Promise.map(sensors, sensor => gpio.openAsync(sensor.gpioPin, 'input'))
.then(Promise.map(sensors, sensor => readSensorData(sensor)));
