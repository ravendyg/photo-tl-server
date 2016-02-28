/// <reference path="../typings/tsd.d.ts" />

const nodeEventEmitter = require('events');

export /**
 * EventEmmiter
 */
class EventEmmiter implements IEventEmmiter {
    
    private _nodeEventEmmiter: any;
    
    constructor() {
        this._nodeEventEmmiter = new nodeEventEmitter();
console.log(this._nodeEventEmmiter);
    }
    
    public emit () {
        this._nodeEventEmmiter.emit('change');
    }
    
    public addChangeListener (callback: any){
        this._nodeEventEmmiter.on('change', callback);
    }
    
    public removeChangeListener (callback: any) {
        this._nodeEventEmmiter.removeListener('change', callback);
    }
}