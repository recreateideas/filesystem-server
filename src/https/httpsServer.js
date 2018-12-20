const https = require('https');
const fs = require('fs');


const createHttpsServer = (args) => {
    const {
        app,
        httpsPort,
    } = args;

    const httpsOptions = {
        key: fs.readFileSync('./security/cert.key'),
        cert: fs.readFileSync('./security/cert.pem')
    };

    const server = https.createServer(httpsOptions, app).listen(httpsPort, () => {
        // console.log('Https server running at ' + httpsPort);
    });
    return server;
};



module.exports = {
    createHttpsServer
};
