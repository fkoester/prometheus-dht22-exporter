#! /bin/env

const client = require('prom-client');
const express = require('express');
require('./sensors');

const server = express();

server.get('/metrics', (req, res) => {
  res.end(client.register.metrics());
});

server.listen(3000);
