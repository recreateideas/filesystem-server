// #!/usr/bin/env node
const express = require('express');
const { printConsole } = require('./utils/consoleLog');
const {createHttpsServer} = require('./https/httpsServer');

var cors = require('cors');

let [, , port, httpsPort] = process.argv;

if (port === undefined) port = 2222;

if (httpsPort === undefined) httpsPort = 4444;

console.log(process.argv);

printConsole(port, httpsPort);

const app = express();

app.use(cors());

createHttpsServer({app, httpsPort});

require('./routes')(app);

app.listen(port);
