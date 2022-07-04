// Imports Details
require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var path = require('path');

const rtsIndex = require('./routes/index.router')

var app = express();

app.use(bodyParser.json({limit:'5mb', extended: true, parameterLimit: 50000 }));
app.use(cors());

app.use('/api', rtsIndex);

const allowedExt = [
    '.js',
    '.ico',
    '.css',
    '.png',
    '.jpg',
    '.woff2',
    '.woff',
    '.ttf',
    '.tif',
    '.svg',
    '.gif'
];


app.get('*', (req, res) => {
    if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
        res.sendFile(path.resolve(`dist/${req.url}`));
    } else {
        res.sendFile(path.resolve('dist/index.html'));
    }
});

app.listen(process.env.PORT, () => console.log(`Server started at port : ${process.env.PORT}`));