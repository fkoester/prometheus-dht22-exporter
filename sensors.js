const client = require('prom-client');
const Promise = require('bluebird');
const dhtSensor = require('node-dht-sensor');

Promise.promisifyAll(dhtSensor, { multiArgs: true });

const sensors = [{
  gpioPin: 17,
  type: 22,
  id: '0',
  description: '',
}, {
  gpioPin: 18,
  type: 22,
  id: '1',
  description: '',
}, {
  gpioPin: 27,
  type: 22,
  id: '2',
  description: '',
}, {
  gpioPin: 22,
  type: 22,
  id: '3',
  description: '',
}, {
  gpioPin: 23,
  type: 22,
  id: '4',
  description: '',
}, {
  gpioPin: 24,
  type: 22,
  id: '5',
  description: '',
}];

const airTempGauge = new client.Gauge('air_temperature', 'Air Temperature in a room', ['sensorId', 'sensorDescription']);
const relHumidityGauge = new client.Gauge('humidity_relative', 'Relative humidity in a room', ['sensorId', 'sensorDescription']);

function readSensorData(sensor) {
  console.log(`Reading sensor id ${sensor.id} with type ${sensor.type} at pin ${sensor.gpioPin}`);
  return dhtSensor.readAsync(sensor.type, sensor.gpioPin)
  .then((reading) => {
    if (!Array.isArray(reading) || reading.length !== 2) {
      console.log('Reading does not have required format. Skipping');
    }
    const temperature = reading[0];
    const humidity = reading[1];
    if (!temperature || !humidity) {
      console.log('Data returned, but temp and/or humidity value undefined');
      return;
    }
    console.log(typeof temperature);
    console.log(typeof humidity);
    console.log(`${sensor.id} ${temperature.toFixed(1)}°C ${humidity.toFixed(1)}%`);
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
