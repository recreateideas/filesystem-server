const fs = require('fs');

module.exports = {
    writeFile: (file, object) => {
        const content = JSON.stringify(object);
        fs.writeFile(file, content, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log(`${file} was saved!`);
        });
    },
};
