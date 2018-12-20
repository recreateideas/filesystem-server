const https = require('https');
const fs = require('fs');
// const exec = require('child_process').exec;


// const installSSLKey = async () => {
//     const generateKey = new Promise( async(resolve, reject) => {
//         exec('cd security/ && ./install.sh',
//             (error, stdout, stderr) => { 
//                 if (error !== null) {
//                     reject(stderr);
//                 } else {
//                     resolve(stdout);
//                 }
//             });
//     });
//     return generateKey; 
// };

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
    // installSSLKey,
    createHttpsServer,
};
