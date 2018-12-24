const fs = require('fs');
const path = require('path');

const findCiqJSON = (fileSource) => {
    const fileName = path.basename(fileSource);
    const absolutePath = path.dirname(fileSource);
    const jsonName = `${fileName.replace(/(store_)(.+)(dev\.js)/g,'$2')}_plain.json`;
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
    findCiqJSON,
    mergeJSONinJS,
};
