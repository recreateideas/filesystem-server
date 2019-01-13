const https = require('https');
const fs = require('fs');

const createHttpsServer = (args) => {
    const {
        app,
        httpsPort,
    } = args;
    let dirname, keyPath, certPath;
    const isWin = process.platform === "win32";
    if(isWin){
        dirname = process.cwd();
        keyPath = '\\security\\cert.key';
        certPath = '\\security\\cert.pem';
    }else {
        dirname = __dirname;
        keyPath = '/../../security/cert.key';
        certPath = '/../../security/cert.pem';
    }
    const httpsOptions = {
        key: fs.readFileSync(dirname + keyPath),
        cert: fs.readFileSync(dirname + certPath),
        requestCert: false,
        rejectUnauthorized: false,
    };

    const httpsServer = https.createServer(httpsOptions, app);
    httpsServer.listen(httpsPort, () => {
    });
    return httpsServer;
};


module.exports = {
    createHttpsServer,
};
