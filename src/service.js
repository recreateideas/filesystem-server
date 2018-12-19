// #!/usr/bin/env node
const express = require('express');
const { printConsole } = require('./utils/consoleLog');
// const { setup } = require('./utils/nativeMessages/setup');

// var nativeMessage = require('chrome-native-messaging');

var cors = require('cors');

//promise this to print console properly
// setup.run();

let [, , port] = process.argv;

if (port === undefined) port = 2222;

printConsole(port);

const app = express();

app.use(cors());

require('./routes')(app);

app.listen(port);






// process.stdin
//     .pipe(new nativeMessage.Input())
//     .pipe(new nativeMessage.Transform(function(msg, push, done) {
//         var reply = getReplyFor(msg); // Implemented elsewhere by you.
//         push({reply:'reply'});                  // Push as many replies as you like.
//         done();                       // Call when done pushing replies.
//     }))
//     .pipe(new nativeMessage.Output())
//     .pipe(process.stdout)
// ;


// function getReplyFor(msg){
//     console.log('msg: ',msg);
//     return msg;
// };
