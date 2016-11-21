#! /bin/sh

npm install
node_modules/.bin/node-deb -- node_modules index.js sensors.js sensorconfig_example.json LICENSE package.json
