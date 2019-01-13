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

        res.json({ fssWatchersConsistent: testHotReload });
    },

    testConnection: (req, res) => {
        console.log(`@@@ :: ${logDate()} -> ping`);
        res.json({ fssConnected: "true" });
    },

    doesFIleExist: (req, res) => {
        const { filePath } = req.params;
        // console.log(fs.existsSync(filePath));
        if (fs.existsSync(filePath)) {
            console.log(`@@@ :: ${logDate()} -> file found: ${filePath}`);
            res.json({ fileExists: 'true' });
        } else {
            console.log(`@@@ :: WARN ${logDate()} -> file does not exist: ${filePath}`);
            res.json({ fileExists: 'false' });
        }
    },

    handleFilePath: async (req, res) => {
        const { filePath } = req.params;

        const errorFile = path.join(__dirname, '/utils/errorFile.js');;

        fs.readFile(filePath, async (error, content) => {
            if (error) {
                if (error.code == 'ENOENT') {
                    console.log(`@@@ :: ERROR  ${logDate()} -> file not found: ${filePath}`);
                    console.log(`@@@ :: sending error file: ${errorFile}`);
                    res.sendFile(errorFile);
                }
                else {
                    console.log(`@@@ :: ERROR  ${logDate()} -> internal Server Error`);
                    res.end({ error: `Unexpected error: ${error}` });
                }
            }
            else {
                console.log(`@@@ :: ${logDate()} -> Serving file: ${filePath}`);
                res.sendFile(filePath);
            }
        });

    },

    enableHotReload: async (ws, req) => {
        // console.log(req);
        ws.on('close', (e) => {
            console.log(e);
            console.log('Socket disconnected. Clearing all watchers.');
            clearWatchers();
        });

        ws.on('message', (msg) => {
            try {
                const { action } = JSON.parse(msg);
                switch (action) {

                    case 'clearWatchers':
                        clearWatchers(ws);
                        break;

                    case 'hotReload':
                    default:
                        hotReload(ws, msg);
                        break;
                }

            } catch (error) {
                ws.send(JSON.stringify({ error }));
            }
        });
    },

};

const clearWatchers = (fileSource, jsonPath) => {
    if (fileWatcher || jsonWatcher) { console.log(`@@@ :: ${logDate()} -> CLEARING WATCHERS `); }
    if (fileWatcher) {
        fileWatcher.close();
        fileWatcher = undefined;
        console.log(`@@@ :: ${logDate()} -> HotReload CLEARED for: ${fileSource}`);
    }
    if (jsonWatcher) {
        jsonWatcher.close();
        fileWatcher = undefined;
        console.log(`@@@ :: ${logDate()} -> HotReload CLEARED for: ${jsonPath}`);
    }
};

const hotReload = (ws, msg) => {
    const { fileSource, hotReload, thisTab, watchJSON } = JSON.parse(msg);

    let jsonPath = findCiqJSON(fileSource);
    if (hotReload) {
        if (fs.existsSync(fileSource)) {
            if (!fileWatcher) {
                fileWatcher = chokidar.watch(fileSource, { usePolling: true, persistent: true, });
                console.log(`@@@ :: ${logDate()} -> HotReload IS ACTIVE for: ${fileSource}`);
                fileWatcher.on('change', fileSource => {
                    console.log(`${fileSource} has changed, reload Tab`);
                    ws.send(JSON.stringify({ thisTab, hotReload, changed: true, fileSource, }));
                });
            }

            if (watchJSON) {
                if (fs.existsSync(jsonPath)) {

                    jsonWatcher = chokidar.watch(jsonPath, { usePolling: true, persistent: true, });
                    console.log(`@@@ :: ${logDate()} -> JSON : HotReload IS ACTIVE for: ${jsonPath}`);
                    jsonWatcher.on('change', jsonPath => {
                        console.log(`${jsonPath} has changed, merge in dev`);
                        mergeJSONinJS(jsonPath, fileSource);
                    });

                } else {
                    console.log(`@@@ :: ${logDate()} -> JSON file doesnt Exist: ${jsonPath}`);
                }
            } else {
                if (jsonWatcher) {
                    jsonWatcher.unwatch(jsonPath);
                    jsonWatcher.close();
                    fileWatcher = undefined;
                    console.log(`@@@ :: ${logDate()} -> HotReload DISABLED for: ${jsonPath}`);
                }
            }

        } else {
            if (fileWatcher) fileWatcher.unwatch(fileSource);
            if (jsonWatcher) jsonWatcher.unwatch(jsonPath);
            console.log(`ERROR: file ${fileSource} doesnt exists! Disabling all the hot reloads.`);
            ws.send(JSON.stringify({ thisTab, hotReload, fileSource, error: `the file doesn't exist` }));
        }
    } else {
        console.log(`@@@ :: ${logDate()} -> DISABLING HOT RELOAD for: ${fileSource}`);
        clearWatchers(fileSource, jsonPath);

        ws.send(JSON.stringify({ thisTab, hotReload, fileSource }));
    }
};


const logDate = () => {
    const date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ampm;
    return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + strTime;
};
