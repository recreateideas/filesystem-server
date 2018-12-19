const chalk = require('chalk');
const figlet = require('figlet');

module.exports = {

    printConsole: (port) => {
        chalk.green(
            figlet('Filesystem Server', (err, data) => {
                if (err) { return; }
                console.log(`\n  
                                    WELCOME TO     
  __________________________________________________________________________________ 
            `);
                console.log(chalk.green(data));

                console.log(`
             #########################################################

                       We're ready to serve your filesystem
                             on Windows, Linux and Mac.        
                           To access a file via API call
                      send its absolute path, uri-encoded to:
                                ${chalk.red(`http://localhost:`)}${chalk.red(`${port}/`)}\n
                         ---------------------------------
       ${chalk.green(`like this->`)} ${chalk.underline(`http://localhost:${port}/${chalk.green(`%2FUsers%2Frecreate%2Fjs%2Ftag_dev.js`)}`)}    
                                              
          ###############################################################
                      \u00A9 ${chalk.blue(`ReCreateIdeas`)} - fork us on GitHub\n
  __________________________________________________________________________________\n
                                ... listening ...
                                      ....
    `);
            })
        );
    }
};
