/**
 * Generic web socket / long polling handler.
 * Only can broadcast for now.
 */

import { Server } from 'http'
import { Express } from 'express';
import * as Ws from 'ws';
import * as WebSocket from 'ws';

export const _path = '/node/ws';

export interface IWebSocketService {
    broadcast: (message: string | ArrayBuffer) => void;

    send: (id: string, message: string | ArrayBuffer) => void;
}

const PING_PERIOD = 30 * 1000;

export class WebSocketService implements IWebSocketService {

    private wss: WebSocket.Server;
    // TODO: think about making a distinction between connections
    // could not make TS compile Set<Ws>
    private wsConnections: { [key: string]: Ws } = {};
    private lpConnections: Express.Response[] = [];

    constructor (private server: Server, private app: Express) {
        this.wss = new Ws.Server({
            server: this.server,
            path: _path,
        });

        // for some reasons => is ignored here
        setInterval(this.heartBeet.bind(this), PING_PERIOD);

        // ws handler
        this.wss.on('connection', ws => {
            const key = (Math.random() * 1e6).toFixed(0);
            this.wsConnections[key] = ws;
            ws.on('message', this.onMessage);
            ws.on('close', (code: number, reason: string) =>
                this.onWsClose(key, code, reason));
        });

        // long poling handlers
        this.app.post(_path, (req, res) => {
            // TODO: add a call to the message processors
            console.log('post lp');
            res.status(400).end();
        });

        this.app.get(_path, (_, res) => {
            this.lpConnections.push(res);
        });
    }

    private heartBeet() {
        Object.keys(this.wsConnections).forEach(key => {
            const ws = this.wsConnections[key];
            ws.ping();
        });
    }

    private onMessage = (message: any) => {
        console.log(message);
    }

    private onWsClose = (key: string, code: number, reason: string) => {
        delete this.wsConnections[key];
        console.log(code, reason);
    }

    broadcast(message: string | ArrayBuffer) {
        Object.keys(this.wsConnections).forEach(key => {
            const ws = this.wsConnections[key];
            ws.send(message);
        });
    }

    /**
     * not implemented
     * fallback to broadcast
     */
    send(_id: string, message: string | ArrayBuffer) {
        this.broadcast(message);
    }
}
