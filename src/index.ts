import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as http from 'http';
import * as logger from 'morgan';
import * as fs from 'fs';
import * as path from 'path';
import * as pump from 'pump';
import { config } from './config';
import { DbService } from './services/DbService';
import { CryptoService } from './services/CryptoService';
import { createUserRouter } from './routes/userRouter';
import { createPhotoRouter } from './routes/photoRouter';
import { createCommentRouter } from './routes/commentRoute';
import { createViewRouter } from './routes/viewRouter';
import { createGetUser } from './middleware/getUser';
import { Utils } from './utils/utils';
import { WebSocketService } from './services/WebSocketService';
import { FileService } from './services/FileService';
import { DataBus } from './services/DataBus';

const app = express();
app.use(logger('tiny'));
app.disable('x-powered-by');
app.set('port', config.port);
app.use(bodyParser.json());
app.use(cookieParser());

const server = http.createServer(app);
const webSocketService = new WebSocketService(server, app);
const cryptoService = new CryptoService();
const utils = new Utils(cryptoService);
const dbService = new DbService(config, utils);
const fileService = new FileService(config, fs, path, pump);
const dataBus = new DataBus(webSocketService);

const getUser = createGetUser(dbService, utils);
const userRouter = createUserRouter(dbService, utils);
const photoRouter = createPhotoRouter(
    getUser,
    dbService,
    utils,
    fileService,
    dataBus,
);
const viewRouter = createViewRouter(getUser, dbService, dataBus);
const commentRoute = createCommentRouter(
    getUser,
    dbService,
    dataBus,
);

app.use('*', (req: Express.Request, _, next) => {
    req.metadata = {};
    next();
});
app.use('/node/user', userRouter);
app.use('/node/photo', photoRouter);
app.use('/node/comment', commentRoute);
app.use('/node/view', viewRouter);

// default NOT_FOUND
app.use('*', function (_, webRes) {
    webRes.status(404).json({ error: 'Not found' });
})

server.listen(app.get('port'), () => {
    console.log(`Server started on ${config.port}`);
});
