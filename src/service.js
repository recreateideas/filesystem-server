const express =require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

require('./routes')(app);

// app.use(errors());
app.listen('2222');

console.log(`Listening on localhost, port: 2222`);
