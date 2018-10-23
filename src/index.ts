import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as http from 'http';
import * as logger from 'morgan';
import { config } from './config';
import { DbService } from './services/DbService';
import { CryptoService } from './services/CryptoService';
import { createUserRouter } from './routes/userRouter';
import { createSessionRouter } from './routes/sessionRouter';
import { createPhotoRouter } from './routes/photoRouter';
import { createGetUser } from './middleware/getUser';
import { Utils } from './utils/utils';
import { SessionService } from './services/SessionService';
import { WebSocketService } from './services/WebSocketService';

const app = express();
app.use(logger('tiny'));
app.disable('x-powered-by');
app.set('port', config.port);
app.use(bodyParser.json());
app.use(cookieParser());

const cryptoService = new CryptoService();
const utils = new Utils(cryptoService);
const dbService = new DbService(config, utils);
const sessionService = new SessionService(utils, dbService);

const getUser = createGetUser(dbService);
const userRouter = createUserRouter(getUser, dbService, sessionService);
const sessionRouter = createSessionRouter(dbService, sessionService);
const photoRouter = createPhotoRouter(getUser, dbService);

app.use('/node/user', userRouter);
app.use('/node/session', sessionRouter);
app.use('/node/photo', photoRouter);


// var fs = require('fs');
// var path = require('path');
// var MongoClient = require('mongodb').MongoClient;
// var engines = require('consolidate');

// var userProcessor = require('./server/user-processor');
// var imageProcessor = require('./server/image-processor');


// app.use(bodyParser.urlencoded({ extended: true }));

// var _path = path.join(__dirname, `..`); //, `photo-tl-angular`);
// var _angularPath = path.join(_path,  `photo-tl-angular`);
// var _reactPath = path.join(_path,  `photo-tl-react`);

// // ignore some suspicious requests
// app.get('/HNAP1*', (req,res,next) => {});
// app.get('/.htaccess*', (req,res,next) => {});

// // connect to db
// MongoClient.connect('mongodb://localhost:27017/photo', function (err, db) {

//     // set up web sockets - inject listeneres
//     require('./server/sockets')(server, db);

//     // sigin-up-out interaction with users
//     app.use('/user-processor', userProcessor(db, _path));

//     // image processor
//     app.use('/image-processor', imageProcessor(db));

//     // common static stuff
//     app.use('/users_data', express.static(path.join(__dirname, `users_data`)));

//     // angular
//     app.use('/angular/build', express.static(path.join(_angularPath, 'build')));
//     app.use('/angular/assets', express.static(path.join(_angularPath, 'assets')));
//     app.get('/angular', function (req, webRes, next) {
//         fs.exists(path.join(_angularPath, 'index.html'), function (exists) {
//             if (exists) {
//                 webRes.sendFile(path.join(_angularPath, 'index.html'));
//             }
//             else {
//                 webRes.status(status.NOT_FOUND).json({ error: 'Not found' });
//             }
//         });
//     });

//     // react
//     app.use('/react/build', express.static(path.join(_reactPath, 'build')));
//     app.use('/react/assets', express.static(path.join(_reactPath, 'assets')));
//     app.get('/react', function (req, webRes, next) {
//         fs.exists(path.join(_reactPath, 'index.html'), function (exists) {
//             if (exists) {
//                 var uId = req.cookies.uId;
//                 if (uId) {
//                     var template = {username: uId.split('|')[0]};
//                     // check cookie
//                     db.collection('users').findOne({
//                         cookies: {$elemMatch: {$eq: uId}}
//                     }, function (err, doc) {
//                         if (err) {
//                             console.error(err.stack);
//                             // can't confirm
//                             template.username = ``;
//                         }
//                         else {
//                             if (!doc) {
//                                 // not confirmed
//                                 template.username = ``;
//                             }
//                         }
//                         webRes.render(path.join(_reactPath, 'index.html'), template);
//                     });
//                 } else {
//                  // webRes.sendFile(path.join(_reactPath, 'index.html'));
//                   webRes.render(path.join(_reactPath, 'index.html'), {
//                         username: ``
//                     });
//                 }
//             }
//             else {
//                 webRes.status(status.NOT_FOUND).json({ error: 'Not found' });
//             }
//         });
//     });

//      app.get('/', function (req, webRes, next) {
//         fs.exists(path.join(__dirname, 'index.html'), function (exists) {
//             if (exists) {
//                 webRes.sendFile(path.join(__dirname, 'index.html'));
//             }
//             else {
//                 webRes.status(status.NOT_FOUND).json({ error: 'Not found' });
//             }
//         });
//     });

// default NOT_FOUND
app.use('*', function (_, webRes) {
    webRes.status(404).json({ error: 'Not found' });
})

//     // start server
//     server.listen(app.get('port'));
//     console.log('Listen on ' + config.get('port'));

//     // exit and errors
//     var exitHandler = function (options, err) {
// 		db.close();
// 		// if (options.cleanup) console.log('clean');
// 		if (err) console.error(err.stack);
// 		if (options.exit) process.exit();
// 	}

// 	process.stdin.resume();//so the program will not close instantly
// 	//do something when app is closing
// 	process.on('exit', exitHandler.bind(null,{cleanup:true}));
// 	//catches ctrl+c event
// 	process.on('SIGINT', exitHandler.bind(null, {exit:true}));
// 	//catches uncaught exceptions
// 	process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
// });

const server = http.createServer(app);
new WebSocketService(server, app);
server.listen(app.get('port'), () => {
    console.log(`Server started on ${config.port}`);
});
