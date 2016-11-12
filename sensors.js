const client = require('prom-client');
const Promise = require('bluebird');
const dhtSensor = require('node-dht-sensor');
const sensors = require('./sensorconfig.json')

Promise.promisifyAll(dhtSensor, { multiArgs: true });

const airTempGauge = new client.Gauge('air_temperature', 'Air Temperature in a room', ['sensorId', 'sensorDescription']);
const relHumidityGauge = new client.Gauge('humidity_relative', 'Relative humidity in a room', ['sensorId', 'sensorDescription']);

function readSensorData(sensor) {
  return dhtSensor.readAsync(sensor.type, sensor.gpioPin)
  .then((reading) => {
    if (!Array.isArray(reading) || reading.length !== 2) {
      console.warn('Reading does not have required format. Skipping');
    }
    const temperature = reading[0];
    const humidity = reading[1];
    if (!temperature || !humidity) {
      console.warn('Data returned, but temp and/or humidity value undefined');
      return;
    }
    airTempGauge.set({
      sensorId: sensor.id,
      sensorDescription: sensor.description,
    }, temperature);
    relHumidityGauge.set({
      sensorId: sensor.id,
      sensorDescription: sensor.description,
    }, humidity);
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
