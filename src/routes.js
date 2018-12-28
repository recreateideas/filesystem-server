const { handleFilePath, enableHotReload, doesFIleExist, testConnection, testWatchers } = require('./controllers');

module.exports = (app) => {

    app.get('/exists/:filePath', doesFIleExist);

    app.get('/files/:filePath', handleFilePath);

    app.ws('/hotReload/', enableHotReload);

    app.get('/testFSSConnection', testConnection);

    app.post('/testWatchers', testWatchers);


};
