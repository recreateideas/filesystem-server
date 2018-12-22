const { handleFilePath, enableHotReload } = require('./controllers');

module.exports = (app) => {

    // app.get(/[^(\/testFSSConnection)]/, handleFilePath);

    app.get('/files/:filePath', handleFilePath);

    app.post('/hotReload/', enableHotReload);

    app.get('/testFSSConnection',(req,res) => {
        console.log(`@@@ :: ${new Date()} -> connected!`);
        res.json({fssConnected:"true"});
    });

};
