#! /bin/sh

npm install
node_modules/.bin/node-deb -- node_modules index.js sensors.js LICENSE package.json
