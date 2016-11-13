const client = require('prom-client');
const Promise = require('bluebird');
const dhtSensor = require('node-dht-sensor');
const sensors = require('/etc/prometheus-dht22-exporter/sensorconfig.json');

Promise.promisifyAll(dhtSensor, { multiArgs: true });

const airTempGauge = new client.Gauge('air_temperature', 'Air Temperature', ['sensorId', 'sensorDescription']);
const relHumidityGauge = new client.Gauge('humidity_relative', 'Humidity (relative)', ['sensorId', 'sensorDescription']);
const absHumidityGauge = new client.Gauge('humidity_absolute', 'Humidity (absolute)', ['sensorId', 'sensorDescription']);

/*
   Returns the Absolute Humidity in grams/m3
   Source:
   https://carnotcycle.wordpress.com/2012/08/04/how-to-convert-relative-humidity-to-absolute-humidity/
   Accurate to within 0.1% over the temperature range –30°C to +35°C
*/
function calcAbsoluteHumidity(relHumidity, temperature) {
  return (6.112 * Math.exp((17.67 * temperature) / (temperature + 243.5)) * relHumidity * 2.1674) / (273.15 + temperature);
}

function readSensorData(sensor) {
  return dhtSensor.readAsync(sensor.type, sensor.gpioPin)
  .then((reading) => {
    if (!Array.isArray(reading) || reading.length !== 2) {
      console.warn('Reading does not have required format. Skipping');
    }
    const temperature = reading[0];
    const relHumidity = reading[1];
    const absHumidity = calcAbsoluteHumidity(relHumidity, temperature);

    airTempGauge.set({
      sensorId: sensor.id,
      sensorDescription: sensor.description,
    }, temperature);
    relHumidityGauge.set({
      sensorId: sensor.id,
      sensorDescription: sensor.description,
    }, relHumidity);
    absHumidityGauge.set({
      sensorId: sensor.id,
      sensorDescription: sensor.description,
    }, absHumidity);
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
