const child_process = require('child_process');

const installSSLKeys = async () => {
    const options = {
                cwd: process.cwd(),
                detached: false,
                stdio: 'inherit',
            };
    child_process.spawn('bash', [__dirname + '/../../security/install.sh'], options,);
};

installSSLKeys();
