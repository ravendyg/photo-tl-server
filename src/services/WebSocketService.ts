import { Server } from 'http'
import { Express } from 'express';
import * as Ws from 'ws';
import * as WebSocket from 'ws';

export const _path = '/node/ws';

export interface IWebSocket {

}

export class WebSocketService implements IWebSocket {
    private ws: WebSocket.Server;

    constructor(private server: Server, private app: Express) {
        this.ws = new Ws.Server({
            server: this.server,
            path: _path,
        });

        // ws handler
        this.ws.on('connection', console.log);

        // long poling handlers
        this.app.post(_path, (req, res) => {
            console.log('post lp');
            res.status(400).end();
        });
        this.app.get(_path, (req, res) => {
            console.log('get lp');
            res.status(400).end();
        });
    }
}
