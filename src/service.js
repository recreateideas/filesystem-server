#!/usr/bin/env node
const express =require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

let [,,port] = process.argv;

if(port === undefined) port = 2222;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

require('./routes')(app);

// app.use(errors());
app.listen(port);

console.log(`
    ##############################################
                                         
        Listening on localhost, port: ${port}     
        ---------------------------------       
        We're ready to serve your filesystem.        
        to access a file via API call
        send its uri-encoded, absolute path to 
        http://localhost:${port}/files/        
                                              
    ##############################################
`);
