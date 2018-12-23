const fs = require('fs');
const path = require('path');
const { writeFile } = require('./utils/helpers');
var chokidar = require('chokidar');

let fileWatcher, jsonWatcher;


const findCiqJSON = (fileSource) => {
    const fileName = path.basename(fileSource);
    const absolutePath = path.dirname(fileSource);
    const jsonName = `${fileName.match(/\d+/)[0]}_plain.json`;
    return path.join(absolutePath, jsonName);
};

const mergeJSONinJS = (jsonPath, fileSource) => {
    try {
        fs.readFile(jsonPath, 'utf8', async (err, content) => {
            if (err) return console.log(err);
            const minifiedJSON = JSON.stringify(JSON.parse(content));
            fs.readFile(fileSource, 'utf8', async (error, fileContent) => {
                const updatedContent = fileContent
                    .replace(/([\s\S]+)(var config_json\s?=\s?\')([\s\S]+)(\'\;[\s\n]+var config_db;)/, `$1$2${minifiedJSON}$4`);
                fs.writeFile(fileSource, updatedContent, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
            });
        });
    } catch (err) {
        return console.log(err);
    }

};


module.exports = {

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

        console.log(watchJSON);

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
                })
                    .on('unlink', path => console.log(`File ${path} has been removed`));

                if(watchJSON){
                    if (jsonWatcher) jsonWatcher.unwatch(jsonPath);
                    jsonWatcher = chokidar.watch(jsonPath, { persistent: true, });
                    jsonWatcher.on('change', jsonPath => {
                        console.log(`${jsonPath} has changed, merge in file`);
                        mergeJSONinJS(jsonPath, fileSource);
                        fileWatcher.unwatch(jsonPath);
                    })
                        .on('unlink', path => console.log(`File ${path} has been removed`));
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
