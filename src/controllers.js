const fs = require('fs');
const path = require('path');
const { writeFile } = require('./utils/helpers');
let hotReloadList = {};
const globalHotReloadFileLocation = path.join(__dirname,'globalHotReload');
// create if doesn't exists

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
        const { enableHotReload, path } = req.params;
        console.log(`@@@ :: ${new Date()} -> ENABLE HotReload for: ${path}`);
        if (enableHotReload) {

            hotReloadList[path] = true;

            writeFile(globalHotReloadFileLocation,hotReloadList);

            // fs.watchFile(path, (curr, prev) => {
            //     console.log('Added');
            // });
        } else {
            // fs.unwatchFile(path, (curr, prev) => {

            // });
        }

        res.sendFile(path);

    },

    hotReload: async (req, res) => {
        const { path, hotReload } = req.params;
        console.log(`@@@ :: ${new Date()} -> HotReload: ${path}`);
        fs.watchFile(path, (curr, prev) => {
            console.log('file changed!');
            console.log(`the current mtime is: ${curr.mtime} - the previous mtime was: ${prev.mtime}`);
        });
        res.sendFile(path);

    },

};

const hotReloadSwitch = () => {

};
