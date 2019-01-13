const fs = require('fs');
const path = require('path');
const { findCiqJSON, mergeJSONinJS } = require('./utils/filesUtils');
const {log} = require('./utils/consoleLog');
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
        log('INFO', 'ping');
        res.json({ fssConnected: "true" });
    },

    doesFIleExist: (req, res) => {
        const { filePath } = req.params;
        // log(fs.existsSync(filePath));
        if (fs.existsSync(filePath)) {
            log('INFO', `file found: ${filePath}`);
            res.json({ fileExists: 'true' });
        } else {
            log('WARN', `file does not exist: ${filePath}`);
            res.json({ fileExists: 'false' });
        }
    },

    handleFilePath: async (req, res) => {
        const { filePath } = req.params;

        const errorFile = path.join(__dirname, '/utils/errorFile.js');;

        fs.readFile(filePath, async (error, content) => {
            if (error) {
                if (error.code == 'ENOENT') {
                    log('ERROR',`file not found: ${filePath}`);
                    log('',`sending error file: ${errorFile}`);
                    res.sendFile(errorFile);
                }
                else {
                    log('ERROR', `internal Server Error`);
                    res.end({ error: `Unexpected error: ${error}` });
                }
            }
            else {
                log('INFO',`Serving file: ${filePath}`);
                res.sendFile(filePath);
            }
        });

    },

    enableHotReload: async (ws, req) => {
        ws.on('close', (e) => {
            log('WARN','Socket disconnected. Clearing all watchers.');
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
    if (fileWatcher || jsonWatcher) { log('INFO', `CLEARING WATCHERS`); }
    if (fileWatcher) {
        fileWatcher.close();
        fileWatcher = undefined;
        log('INFO', `HotReload CLEARED for: ${fileSource}`);
    }
    if (jsonWatcher) {
        jsonWatcher.close();
        fileWatcher = undefined;
        log('INFO', `HotReload CLEARED for: ${jsonPath}`);
    }
};

const hotReload = (ws, msg) => {
    const { fileSource, hotReload, thisTab, watchJSON } = JSON.parse(msg);

    let jsonPath = findCiqJSON(fileSource);
    if (hotReload) {
        if (fs.existsSync(fileSource)) {
            if (!fileWatcher) {
                fileWatcher = chokidar.watch(fileSource, { usePolling: true, persistent: true, });
                log('INFO',`HotReload IS ACTIVE for: ${fileSource}`);
                fileWatcher.on('change', fileSource => {
                    log('INFO', `${fileSource} has changed, reload Tab`);
                    ws.send(JSON.stringify({ thisTab, hotReload, changed: true, fileSource, }));
                });
            }

            if (watchJSON) {
                if (fs.existsSync(jsonPath)) {

                    jsonWatcher = chokidar.watch(jsonPath, { usePolling: true, persistent: true, });
                    log('INFO', `JSON : HotReload IS ACTIVE for: ${jsonPath}`);
                    jsonWatcher.on('change', jsonPath => {
                        log('INFO', `${jsonPath} has changed, merge in dev`);
                        mergeJSONinJS(jsonPath, fileSource);
                    });

                } else {
                    log('INFO',`JSON file doesnt Exist: ${jsonPath}`);
                }
            } else {
                if (jsonWatcher) {
                    jsonWatcher.unwatch(jsonPath);
                    jsonWatcher.close();
                    fileWatcher = undefined;
                    log('INFO',`HotReload DISABLED for: ${jsonPath}`);
                }
            }

        } else {
            if (fileWatcher) fileWatcher.unwatch(fileSource);
            if (jsonWatcher) jsonWatcher.unwatch(jsonPath);
            log('ERROR',`file ${fileSource} doesnt exists! Disabling all the hot reloads.`);
            ws.send(JSON.stringify({ thisTab, hotReload, fileSource, error: `the file doesn't exist` }));
        }
    } else {
        log('INFO',`DISABLING HOT RELOAD for: ${fileSource}`);
        clearWatchers(fileSource, jsonPath);

        ws.send(JSON.stringify({ thisTab, hotReload, fileSource }));
    }
};
