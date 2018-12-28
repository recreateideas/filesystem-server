#!/usr/bin/env forever

const express = require('express');
const { printConsole } = require('./utils/consoleLog');
const bodyParser = require('body-parser');
const { createHttpsServer } = require('./https/httpsServer');
const cors = require('cors');
// const applyRoutes = require('./routes');
const { handleArgs } = require('./utils/handleStdInArgs');

const { port, httpsPort } = handleArgs(process);
const app = express();
const httpsServer = createHttpsServer({ app, httpsPort });

require('express-ws')(app,httpsServer);


printConsole(port, httpsPort);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes')(app);

app.listen(port);
