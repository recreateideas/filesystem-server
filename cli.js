#!/usr/bin/env node

var forever = require('forever-monitor');
const { handleArgs } = require('./src/utils/handleStdInArgs');

const { port, httpsPort } = handleArgs(process);

  var child = new (forever.Monitor)('src/service.js', {
    max: 3,
    silent: false,
    args: [port, httpsPort]
  });

  child.on('exit', function () { console.log('service.js has exited after 3 restarts'); });

  child.start();
