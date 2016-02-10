/// <reference path="./typings/others.d.ts" />
var express = require('express'), app = express();
var fs = require('fs');
var path = require('path');
var config = require('./config');
app.disable('x-powered-by');
app.set('port', config.get('port'));
app.use(express.static(path.join(__dirname, config.get('src'))));
console.log(path.join(__dirname, config.get('src')));
app.get('/', function (req, webRes, next) {
    fs.exists(path.join(__dirname, config.get('src'), 'index.html'), function (exists) {
        if (exists) {
            webRes.sendFile(path.join(__dirname, config.get('src'), 'index.html'));
        }
        else {
            webRes.status(404).json({ error: 'Not found' });
        }
    });
});
app.listen(app.get('port'));
console.log('Listen on ' + config.get('port'));
// console.log(path.join(__dirname, config.get('src'), 'index.html')); 

//# sourceMappingURL=maps/server.js.map
