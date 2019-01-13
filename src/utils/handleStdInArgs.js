
module.exports = {
    handleArgs: (process) => {

        let [, , port, httpsPort] = process.argv;

        if (port === undefined) port = 2222;

        if (httpsPort === undefined) httpsPort = 4444;

        return { port, httpsPort };
    }
};
