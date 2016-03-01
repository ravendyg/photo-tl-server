/// <reference path="./typings/others.d.ts" />
var express = require('express'),
    app = express(),
    status = require('http-status'),
	bodyParser = require('body-parser');
var server = require('http').Server(app);
var fs = require('fs');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;

var config = require('./server/config');
var userProcessor = require('./server/user-processor');
var imageProcessor = require('./server/image-processor');


app.disable('x-powered-by');

app.set('port', config.get('port'));

// hide express
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var _path = path.join(__dirname, `..`, `photo-tl-angular`);
console.log(_path);

// connect to db
MongoClient.connect('mongodb://localhost:27017/photo', function (err, db) {
    
    // set up web sockets - inject listeneres
    require('./server/sockets')(server, db);
  
    // sigin-up-out interaction with users
    app.use('/user-processor', userProcessor(db, _path));
    
    // image processor
    app.use('/image-processor', imageProcessor(db));

    // index
    app.get('/angular', function (req, webRes, next) {
        fs.exists(path.join(_path, config.get('src'), 'index.html'), function (exists) {
            if (exists) {
                webRes.sendFile(path.join(_path, config.get('src'), 'index.html'));
            }
            else {
                webRes.status(status.NOT_FOUND).json({ error: 'Not found' });
            }
        });
    });
console.log(_path);
    // common static stuff
    app.use('/users_data', express.static(path.join(__dirname, `..`, `photo-tl-server`, `users_data`)));
console.log(path.join(__dirname, `..`, `photo-tl-server`, `users_data`));
    if (config.get('src') === `src`) {
        app.use('/src', express.static(path.join(_path, config.get('src'))));
        app.use('/node_modules', express.static(path.join(_path, 'node_modules')));
        app.use('/prebuild', express.static(path.join(_path, 'prebuild')));
        app.use('/components', express.static(path.join(_path, config.get('src'), 'components')));
        app.use('/assets', express.static(path.join(_path, config.get('src'), 'assets')));
        // app.use('/users_data', express.static(path.join(__dirname, `..`, `photo-tl-server`, `users_data`)));
    } else {
        app.use(express.static(path.join(_path, config.get('src'))));
    }

    // default NOT_FOUND
    app.use('*', function (req, webRes, next) {
        webRes.status(status.NOT_FOUND).json({ error: 'Not found' });
    })

    // start server
    server.listen(app.get('port'));
    console.log('Listen on ' + config.get('port'));
    
    // exit and errors
    var exitHandler = function (options, err) {
		db.close();
		// if (options.cleanup) console.log('clean');
		if (err) console.error(err.stack);
		if (options.exit) process.exit();
	}
	process.stdin.resume();//so the program will not close instantly
	//do something when app is closing
	process.on('exit', exitHandler.bind(null,{cleanup:true}));
	//catches ctrl+c event
	process.on('SIGINT', exitHandler.bind(null, {exit:true}));
	//catches uncaught exceptions
	process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
});