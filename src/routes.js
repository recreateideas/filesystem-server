const { handleFilePath } = require('./controllers');

module.exports = (app) => {

    app.get(/[^(\/testFSSConnection)]/, handleFilePath);

    app.get('/testFSSConnection',(req,res) => {
        console.log(`@@@ :: ${new Date()} -> Filesystem is connected!`);
        res.json({fssConnected:"true"});
    });

};
