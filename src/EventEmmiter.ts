/// <reference path="./interfaces.d.ts" />

export class EventEmmiter implements IEventEmmiter {
    private _listeners;
    
    constructor () {
        this._listeners = [];
    }
    
    public emit (event) {
        for (var i=0; i<this._listeners.length; i++) {
            this._listeners[i](event);    
        }
    }
    
    public addListener (listener) {
        this._listeners.push(listener);
        return this._listeners.length - 1;
    }
}
