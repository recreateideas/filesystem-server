const fs = require('fs');
const path = require('path');
const { writeFile } = require('./utils/helpers');
var chokidar = require('chokidar');

const globalHotReloadFileLocation = path.join(__dirname,'globalHotReload'); // create if doesn't exists
let hotReloadList = {};
let watchFile;

fs.watchFile(globalHotReloadFileLocation, (curr, prev) => {
    console.log(`watching ${globalHotReloadFileLocation}`);
});

module.exports = {

    handleFilePath: async (req, res) => {
        const {filePath} = req.params;
        var contentType = 'text/html';
        var extname = path.extname(filePath);
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
            case '.json':
                contentType = 'application/json';
                break;
            case '.png':
                contentType = 'image/png';
                break;      
            case '.jpg':
                contentType = 'image/jpg';
                break;
            case '.wav':
                contentType = 'audio/wav';
                break;
        }
        fs.readFile(filePath, async(error, content) => {
            if (error) {
                if(error.code == 'ENOENT'){
                    res.writeHead(200, { 'Content-Type': contentType });
                    console.log(`@@@ :: ERROR  ${new Date()} -> file not found: ${filePath}`);
                    res.end("#file not found#", 'utf-8');
                }
                else {
                    res.writeHead(500);
                    console.log(`@@@ :: ERROR  ${new Date()} -> internal Server Error`);
                    res.end('Sorry, check with us for error: '+error.code+' ..\n');
                }
            }
            else {
                console.log(`@@@ :: ${new Date()} -> Serving file: ${filePath}`);
                res.sendFile(filePath);
            }
        });

    },

    enableHotReload: async (req, res) => {
        const { fileSource, hotReload } = req.body;

        if (hotReload) {
            if (fs.existsSync(fileSource)) {
                console.log(`@@@ :: ${new Date()} -> ENABLED HotReload for: ${fileSource}`);
                if(watchFile) watchFile.unwatch(fileSource);

                watchFile = chokidar.watch(fileSource,{persistent: true,});

                watchFile.on('change', fileSource => {
                    console.log(`${fileSource} has changed, reload Tab`);
                    watchFile.unwatch(fileSource);
                    res.json({hotReload, changed: true, fileSource,});
                })
                .on('unlink', path => console.log(`File ${path} has been removed`));

            } else {
                if(watchFile) watchFile.unwatch(fileSource);

                console.log(`ERROR: file ${fileSource} doesnt exists!`);
                res.json({hotReload, fileSource, error: `the file doesn't exist`});
            }
        } else {
            console.log(`@@@ :: ${new Date()} -> DISABLED HotReload for: ${fileSource}`);
            if(watchFile) watchFile.unwatch(fileSource);

            res.json({hotReload, fileSource});
        }
        // res.end(`hotReload value was not acceptable: ${hotReload}`);
    },

};
