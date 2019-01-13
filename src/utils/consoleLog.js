const figlet = require('figlet');

module.exports = {

    printConsole: (port, httpsPort) => {
        figlet('Filesystem Server', (err, data) => {
            if (err) { return; }
            console.log(`\n  
                                    WELCOME TO     
  __________________________________________________________________________________ 
            `);
            console.log(data);

            console.log(`
             #########################################################

                       We're ready to serve your filesystem.    
                           To access a file via API call
                      send its absolute path, uri-encoded to:\n
                           http://localhost:${port}/files/
                                         or
                           https://localhost:${httpsPort}/files/\n
                         ---------------------------------
   like this-> http://localhost:${port}/files/%2FUsers%2Frecreate%2Fjs%2Ftag_dev.js

 or like this-> https://localhost:${httpsPort}/files/%2FUsers%2Frecreate%2Fjs%2Ftag_dev.js    
                                              
          ###############################################################
                      \u00A9 ReCreateIdeas - fork us on GitHub\n
  __________________________________________________________________________________\n
                                ... listening ...
                                      ....
            `);
        });
    }
};
