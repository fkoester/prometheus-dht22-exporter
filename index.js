#! /bin/env

const client = require('prom-client');
const express = require('express');
const cors = require('cors');
require('./sensors');

const server = express();

server.use(cors());

server.get('/metrics', (req, res) => {
  res.header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
  res.end(client.register.metrics());
});

server.listen(3000);
