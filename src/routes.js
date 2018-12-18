const { handleFilePath } = require('./controllers');

module.exports = (app) => {

    app.get(/[^(\/testConnection)]/, handleFilePath);

    app.get('/testConnection',(req,res) => {
        console.log(`@@@ :: ${new Date()} -> Filesystem is connected!`);
        res.json({fssConnected:"true"});
    });

};
