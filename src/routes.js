const { handleFilePath } = require('./controllers');

module.exports = (app) => {

    app.get('/files/:path', handleFilePath);

    app.get('/testConnection',(req,res) => {
        console.log('tested');
        res.json({fssConnected:"true"});
    });

};
