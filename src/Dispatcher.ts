/// <reference path="../typings/tsd.d.ts" />

export class Dispatcher implements IDispatcher {
    private _lastListenerId: number;
    private _listenersCounter: number;
    private _listeners: any;
    
    constructor () {
        this._lastListenerId = 0;
        this._listenersCounter = 0;
        this._listeners = {};
    }
    
    public dispatch (payload): void {
        for (var key in this._listeners) {
            this._listeners[key](payload);
        }       
    }
    
    public register (listener: any): number {
        this._listeners[++this._lastListenerId] = listener;
        return ++this._listenersCounter;
    }
    
    public unregister (listenerId: number): void {
        delete this._listeners[listenerId];
    }
}
