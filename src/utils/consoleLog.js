const chalk = require('chalk');
const figlet = require('figlet');

module.exports = {

    printConsole: (port) => {
        chalk.green(
            figlet('Filesystem Server', (err, data) => {
                if (err) { return; }
                console.log(`        
  ____________________________________________________________________________________
                                     WELCOME TO
            `);
                console.log(chalk.green(data));

                console.log(`
             #########################################################
                                         
                         Listening on localhost, port: ${port}     
                         ---------------------------------\n       
                       We're ready to serve your filesystem.        
                           To access a file via API call
                             send its absolute path to:
                                ${chalk.red(`http://localhost:`)}${chalk.red(port)}\n
                         ---------------------------------
          ${chalk.green(`like this->`)} ${chalk.underline(`http://localhost:${port}${chalk.green(`/Users/recreate/js/tag_dev.js`)}`)}    
                                              
          ###############################################################
                      \u00A9 ${chalk.blue(`ReCreateIdeas`)} - fork us on GitHub\n
  ____________________________________________________________________________________
    `);
            })
        );
    }
};
