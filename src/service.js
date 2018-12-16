#!/usr/bin/env node
const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const figlet = require('figlet');
var cors = require('cors');

let [, , port] = process.argv;

if (port === undefined) port = 2222;
// let port = 2222;

chalk.green(
    figlet('Filesystem Server', (err, data) => {
        if (err) {return;}
        console.log(`
_____________________________________________________________________________________
                                WELCOME TO
        `);
        console.log(chalk.green(data));

        console.log(`
            ##############################################
                                     
                Listening on localhost, port: ${port}     
                ---------------------------------       
                We're ready to serve your filesystem.        
                to access a file via API call
                send its uri-encoded, absolute path to 
                    ${chalk.red(`http://localhost:`)}${chalk.red(port)}${chalk.red(`/files/`)}        
                                          
            ##############################################
                \u00A9 ${chalk.blue(`ReCreateIdeas`)} - find repo on GitHub\n
_____________________________________________________________________________________
`);
    })
);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

require('./routes')(app);

// app.use(errors());
app.listen(port);
