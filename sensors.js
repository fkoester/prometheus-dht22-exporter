const client = require('prom-client');
const Promise = require('bluebird');
const dhtSensor = require("node-dht-sensor");

Promise.promisifyAll(dhtSensor);

const sensors = [{
  gpioPin: 11,
  type: 22,
  id: '0',
  description: '',
}, {
  gpioPin: 12,
  type: 22,
  id: '1',
  description: '',
}, {
  gpioPin: 13,
  type: 22,
  id: '2',
  description: '',
}, {
  gpioPin: 15,
  type: 22,
  id: '3',
  description: '',
}, {
  gpioPin: 16,
  type: 22,
  id: '4',
  description: '',
}, {
  gpioPin: 18,
  type: 22,
  id: '5',
  description: '',
}];

const airTempGauge = new client.Gauge('air_temperature', 'Air Temperature in a room', ['sensorId', 'sensorDescription']);
const relHumidityGauge = new client.Gauge('humidity_relative', 'Relative humidity in a room', ['sensorId', 'sensorDescription']);

function readSensorData(sensor) {
  dhtSensor.readAsync(sensor.type, sensor.gpioPin)
  .then((reading) => {
    if (!reading) {
      console.log('No data returned, skipping.');
      return;
    }
    if (!reading.temperature || !reading.humidity) {
      console.log('Data returned, but temp and/or humidity value undefined');
      return;
    }
    console.log(typeof reading.temperature);
    console.log(typeof reading.humidity);
    console.log(`${sensor.id} ${reading.temperature.toFixed(1)}°C ${reading.humidity.toFixed(1)}%`);
    airTempGauge.set({
      sensorId: sensor.id,
      sensorDescription: sensor.description,
    }, reading.temperature);
    relHumidityGauge.set({
      sensorId: sensor.id,
      sensorDescription: sensor.description,
    }, reading.humidity);
  })
  .catch((err) => {
    console.warn(err);
  });
}

function readSensors() {
  Promise.mapSeries(sensors, sensor => readSensorData(sensor))
  .delay(3000)
  .then(readSensors);
}

readSensors();
