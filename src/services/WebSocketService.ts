/**
 * Generic web socket / long polling handler.
 * Only can broadcast for now.
 */

import { Server } from 'http'
import { Express } from 'express';
import { Request, Response } from 'express-serve-static-core';
import * as Ws from 'ws';
import * as WebSocket from 'ws';

export const _path = '/node';

export interface IWebSocketService {
    broadcast: (message: any) => void;

    send: (id: string, message: string | ArrayBuffer) => void;
}

const PING_PERIOD = 30 * 1000;

export class WebSocketService implements IWebSocketService {

    private wss: WebSocket.Server;
    // TODO: think about making a distinction between connections
    // could not make TS compile Set<Ws>
    private wsConnections: { [key: string]: Ws } = {};
    private lpConnections: Response[] = [];

    constructor (private server: Server, private app: Express) {
        this.wss = new Ws.Server({
            server: this.server,
            path: `${_path}/ws`,
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
            // check that connection works
            ws.ping();
        });

        // long poling handlers
        this.app.post(`${_path}/lp`, (req: Request, res: Response) => {
            // TODO: add a call to the message processors
            console.log('post lp');
            res.status(400).end();
        });

        this.app.get(`${_path}/lp`, (req: Request, res: Response) => {
            this.lpConnections.push(res);
            req.on('close', () => {
                this.lpConnections = this.lpConnections.filter(connection => connection !== res);
            });
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

    broadcast(message: any) {
        Object.keys(this.wsConnections).forEach(key => {
            const ws = this.wsConnections[key];
            ws.send(message);
        });
        const activeLpConnection = this.lpConnections;
        this.lpConnections = [];
        activeLpConnection.forEach(res => {
            res.json({
                status: 200,
                payload: message,
            });
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
