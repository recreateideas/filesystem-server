
const express = require('express');
const { printConsole } = require('./utils/consoleLog');
const bodyParser = require('body-parser');
const { createHttpsServer } = require('./https/httpsServer');
const cors = require('cors');
const http = require('http');
const { handleArgs } = require('./utils/handleStdInArgs');
const expressWs = require('express-ws');
const routes = require('./routes');

const { port, httpsPort } = handleArgs(process);
const app = express();
const httpsServer = createHttpsServer({ app, httpsPort });
const httpServer = http.createServer(app).listen(port);

expressWs(app, httpServer);
expressWs(app, httpsServer);

printConsole(port, httpsPort);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

// app.listen(port);
