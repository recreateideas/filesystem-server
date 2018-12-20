const chalk = require('chalk');
const figlet = require('figlet');

module.exports = {

    printConsole: (port, httpsPort) => {
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
                      send its absolute path, uri-encoded to:\n
                            ${chalk.red(`http://localhost:`)}${chalk.red(`${port}/files/`)}
                                       or
                           ${chalk.red(`https://localhost:`)}${chalk.red(`${httpsPort}/files/`)}\n
                         ---------------------------------
   ${chalk.green(`like this->`)} ${chalk.underline(`http://localhost:${port}/files/${chalk.green(`%2FUsers%2Frecreate%2Fjs%2Ftag_dev.js`)}`)}

 or  ${chalk.green(`like this->`)} ${chalk.underline(`https://localhost:${httpsPort}/files/${chalk.green(`%2FUsers%2Frecreate%2Fjs%2Ftag_dev.js`)}`)}    
                                              
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
