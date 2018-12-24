const fs = require('fs');
const path = require('path');
const {findCiqJSON, mergeJSONinJS } = require('./utils/filesUtils');
var chokidar = require('chokidar');

let fileWatcher, jsonWatcher;


module.exports = {

    doesFIleExist: (req, res) => {
        const { filePath } = req.params;
        if (fs.existsSync(filePath)) {
            console.log(`@@@ :: WARN ${new Date()} -> file exists: ${filePath}`);
            res.json({ fileExists: 'true' });
        } else {
            console.log(`@@@ :: WARN ${new Date()} -> file does not exist: ${filePath}`);
            res.json({ fileExists: 'false' });
        }
    },

    handleFilePath: async (req, res) => {
        const { filePath } = req.params;

        const errorFile = path.join(__dirname, '/utils/errorFile.js');;

        fs.readFile(filePath, async (error, content) => {
            if (error) {
                if (error.code == 'ENOENT') {
                    console.log(`@@@ :: ERROR  ${new Date()} -> file not found: ${filePath}`);
                    console.log(`@@@ :: sending error file: ${errorFile}`);
                    res.sendFile(errorFile);
                }
                else {
                    console.log(`@@@ :: ERROR  ${new Date()} -> internal Server Error`);
                    res.end({ error: `Unexpected error: ${error}` });
                }
            }
            else {
                console.log(`@@@ :: ${new Date()} -> Serving file: ${filePath}`);
                res.sendFile(filePath);
            }
        });

    },

    enableHotReload: async (req, res) => {
        const { fileSource, hotReload, thisTab, watchJSON } = req.body;

        let jsonPath = findCiqJSON(fileSource);

        if (hotReload) {
            if (fs.existsSync(fileSource)) {
                console.log(`@@@ :: ${new Date()} -> HotReload IS ACTIVE for: ${fileSource}`);
                if (fileWatcher) fileWatcher.unwatch(fileSource);
                fileWatcher = chokidar.watch(fileSource, { persistent: true, });
                fileWatcher.on('change', fileSource => {
                    console.log(`${fileSource} has changed, reload Tab`);
                    fileWatcher.unwatch(fileSource);
                    res.json({ thisTab, hotReload, changed: true, fileSource, });
                }).on('unlink', path => console.log(`File ${path} has been removed`));

                if(watchJSON){
                    if (fs.existsSync(jsonPath)) {
                        if (jsonWatcher) jsonWatcher.unwatch(jsonPath);
                        jsonWatcher = chokidar.watch(jsonPath, { persistent: true, });
                        console.log(`@@@ :: ${new Date()} -> JSON : HotReload IS ACTIVE for: ${jsonPath}`);
                        jsonWatcher.on('change', jsonPath => {
                            console.log(`${jsonPath} has changed, merge in file`);
                            mergeJSONinJS(jsonPath, fileSource);
                            fileWatcher.unwatch(jsonPath);
                        }).on('unlink', path => console.log(`File ${path} has been removed`));
                    } else {
                        console.log(`@@@ :: ${new Date()} -> JSON file doesnt Exist: ${jsonPath}`);
                    }
                } else {
                    if (jsonWatcher) jsonWatcher.unwatch(jsonPath);
                }

            } else {
                if (fileWatcher) fileWatcher.unwatch(fileSource);
                if (jsonWatcher) jsonWatcher.unwatch(jsonPath);
                console.log(`ERROR: file ${fileSource} doesnt exists!`);
                res.json({ thisTab, hotReload, fileSource, error: `the file doesn't exist` });
            }
        } else {
            console.log(`@@@ :: ${new Date()} -> HotReload NOT ACTIVE for: ${fileSource}`);
            if (fileWatcher) fileWatcher.unwatch(fileSource);
            if (jsonWatcher) jsonWatcher.unwatch(jsonPath);

            res.json({ thisTab, hotReload, fileSource });
        }
        // res.end(`hotReload value was not acceptable: ${hotReload}`);
    },

};
