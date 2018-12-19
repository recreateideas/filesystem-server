// #!/usr/bin/env node
const express = require('express');
const { printConsole } = require('./utils/consoleLog');

var cors = require('cors');

let [, , port] = process.argv;

if (port === undefined) port = 2222;

printConsole(port);

const app = express();

app.use(cors());

require('./routes')(app);

app.listen(port);
