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
    // installSSLKey,
    createHttpsServer,
};
