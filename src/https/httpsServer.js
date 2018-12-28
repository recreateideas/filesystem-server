const https = require('https');
const fs = require('fs');

const createHttpsServer = (args) => {
    const {
        app,
        httpsPort,
    } = args;

    const httpsOptions = {
        key: fs.readFileSync(__dirname + '/../../security/cert.key'),
        cert: fs.readFileSync(__dirname + '/../../security/cert.pem')
    };

    const httpsServer = https.createServer(httpsOptions, app);

    httpsServer.listen(httpsPort, () => {
        if(httpsServer) console.log('\nHTTPS Server setup.');
    });
    return httpsServer;
};


module.exports = {
    createHttpsServer,
};
