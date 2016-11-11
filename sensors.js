const gpio = require('pi-gpio');
const client = require('prom-client');
const Promise = require('bluebird');

Promise.promisifyAll(gpio);

const sensors = [{
  gpioPin: 0,
  sensorId: '',
  sensorDescription: '',
}];

const airTempGauge = new client.Gauge('air_temperature', 'Air Temperature in a room', ['sensorId', 'sensorDescription']);
const relHumidityGauge = new client.Gauge('humidity_relative', 'Relative humidity in a room', ['sensorId', 'sensorDescription']);

function readSensorData(sensor) {

  gpio.readAsync(sensor.gpioPin)
  .then((value) => {
    console.log(value);
    //tempGauge.set(parseFloat(data));
  });
}

Promise.map(sensors, (sensor) => gpio.openAsync(sensor.gpioPin, 'input'))
.then(() => Promise.map(sensors, (sensor) => readSensor(sensor));
