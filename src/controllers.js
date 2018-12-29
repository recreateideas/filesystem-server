const fs = require('fs');
const path = require('path');
const { findCiqJSON, mergeJSONinJS } = require('./utils/filesUtils');
var chokidar = require('chokidar');

let fileWatcher, jsonWatcher;


module.exports = {

    testWatchers: (req, res) => {
        const { hotReload, watchJSON } = req.body;
        const testHotReload = ((hotReload && fileWatcher !== undefined) || (!hotReload && fileWatcher === undefined)) &&
            ((watchJSON && jsonWatcher !== undefined) || (!watchJSON && jsonWatcher === undefined)) ? "true" : "false";
        console.log(`@@@ :: ${new Date()} -> Do watchers match the dom? Answer: ${testHotReload}`);
        res.json({ fssWatchersConsistent: testHotReload });
    },

    testConnection: (req, res) => {
        console.log(`@@@ :: ${new Date()} -> connected`);
        res.json({ fssConnected: "true" });
    },

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

    enableHotReload: async (ws, req) => {
        // console.log(req);
        ws.on('close', () => {
            console.log('Socket disconnected. Clearing all watcherds.');
            clearWatchers();
        });

        ws.on('message', (msg) => {
            try {
                const { action } = JSON.parse(msg);
                console.log(`action: ${action}`);
                switch(action){
                    
                    case 'clearWatchers':
                    clearWatchers();
                    break;
                    case 'hotReload':
                    default:
                    hotReload(msg);
                    break;
                }
              
            } catch (error) {
                ws.send(JSON.stringify({ error }));
            }
        });
    },

};

const clearWatchers = (fileSource, jsonPath) => {
    console.log(`@@@ :: ${new Date()} -> CLEARING ALL WATCHERS`);
    if (fileWatcher) {
        fileWatcher.close();
        fileWatcher = undefined;
        console.log(`@@@ :: ${new Date()} -> HotReload CLEARED for: ${fileSource}`);
    }
    if (jsonWatcher) {
        jsonWatcher.close();
        fileWatcher = undefined;
        console.log(`@@@ :: ${new Date()} -> HotReload CLEARED for: ${jsonPath}`);
    }
};

const hotReload = (msg) => {
    const { fileSource, hotReload, thisTab, watchJSON } = JSON.parse(msg);

    let jsonPath = findCiqJSON(fileSource);
    if (hotReload) {
        if (fs.existsSync(fileSource)) {
            if(!fileWatcher){
                fileWatcher = chokidar.watch(fileSource, { persistent: true, });
                console.log(`@@@ :: ${new Date()} -> HotReload IS ACTIVE for: ${fileSource}`);
                fileWatcher.on('change', fileSource => {
                    console.log(`${fileSource} has changed, reload Tab`);
                    if(ws.readyState !== ws.CLOSED) ws.send(JSON.stringify({ thisTab, hotReload, changed: true, fileSource, }));
                });    
            }

            if (watchJSON) {
                if (fs.existsSync(jsonPath)) {
                    if(!jsonWatcher){
                        jsonWatcher = chokidar.watch(jsonPath, { persistent: true, });
                        console.log(`@@@ :: ${new Date()} -> JSON : HotReload IS ACTIVE for: ${jsonPath}`);
                        jsonWatcher.on('change', jsonPath => {
                            console.log(`${jsonPath} has changed, merge in dev`);
                            mergeJSONinJS(jsonPath, fileSource);
                        });

                    }
                } else {
                    console.log(`@@@ :: ${new Date()} -> JSON file doesnt Exist: ${jsonPath}`);
                }
            } else {
                if (jsonWatcher) {
                    jsonWatcher.unwatch(jsonPath);
                    console.log(`@@@ :: ${new Date()} -> HotReload DISABLED for: ${jsonPath}`);
                }
            }

        } else {
            if (fileWatcher) fileWatcher.unwatch(fileSource);
            if (jsonWatcher) jsonWatcher.unwatch(jsonPath);
            console.log(`ERROR: file ${fileSource} doesnt exists! Disabling all the hot reloads.`);
            ws.send(JSON.stringify({ thisTab, hotReload, fileSource, error: `the file doesn't exist` }));
        }
    } else {
        clearWatchers(fileSource, jsonPath);

        ws.send(JSON.stringify({ thisTab, hotReload, fileSource }));
    }
};
