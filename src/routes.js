const { handleFilePath } = require('./controllers');

module.exports = (app) => {

    app.get('/files/:path', handleFilePath);

    app.get('/testConnection',(req,res) => {
        console.log('Filesystem connected!');
        res.json({fssConnected:"true"});
    });

};
