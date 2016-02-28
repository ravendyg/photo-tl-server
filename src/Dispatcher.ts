/// <reference path="../typings/tsd.d.ts" />

export class Dispatcher implements IDispatcher {
    private _lastListenerId: number;
    private _listenersCounter: number;
    private _listeners: any;
    private _tokens: any;
    private _pending: any;
    private _queue: any;
    private _probes: any [];
    
    constructor () {
        this._lastListenerId = 0;
        this._listenersCounter = 0;
        this._listeners = {};
        this._tokens = {};
        this._pending = {};
        this._queue = {};
        this._probes = [];
    }
    
    public emit (event): void {
        for (var key in this._listeners) {
            this._listeners[key](event);
        }
        // try to execute waiting functions if any
        if (this._probes.length) {
            this._probe();    
        }        
    }
    
    public addListener (listener: any): number {
        this._listeners[++this._lastListenerId] = listener;
        return ++this._listenersCounter;
    }
    
    public removeListener (listenerId: number): void {
        delete this._listeners[listenerId];
    }
    
    public setToken (tokenName: string, listenerId: number): void {
        this._tokens[tokenName] = listenerId;
        
        this._pending[tokenName] = false;
    }
    
    public getTokens (): any {
        return this._tokens;
    }
    
    public startHandling (tokenName: string): void {
        this._pending[tokenName] = true;
    }
    
    public stopHandling (tokenName: string): void {
        this._pending[tokenName] = false;
    }
    
    public waitFor(tokenNames: string [], deferred: any, owner: string): any {
        // handle angular d.resolve() && d.promise()
        // and js promise d.resolve() && d itself
        var promise = deferred.promise || deferred;
        
        // put a store that requested waitFor in the queue
        this._queue[owner] = tokenNames;
        // check it's dependencies for circular links
        for (var j=0; j<tokenNames.length; j++) {
            if (this._queue[tokenNames[j]] && this._queue[tokenNames[j]].indexOf(owner) !== -1) {
                // circular
                console.error('circular dependency in waitFor, requested by ' + owner);
                deferred.resolve();
                return promise;
            }
        }
        
        // no circular links, register a probe
        this._probes.push({
            tokenNames,
            deferred,
            started: Date.now()
        });

        return promise;
    }
    
    /** checks for all specified dependencies to be fulfilled 
     * called from emit()
     * if positive resolves provided promise
     * and removes executed probe from the array
     * if awaiting time is more that 10 secs report an error an remove the probe
     */
    private _probe () {
        var i = 0;
        while (i<this._probes.length) {
            var pending = false;
            for (var i=0; i<this._probes[i].tokenNames.length; i++) {
                console.log(this._probes[i].tokenNames[i] + ' pending: ' + this._pending[this._probes[i].tokenNames[i]]);
                pending = pending || this._pending[this._probes[i].tokenNames[i]];
            }
            // all conditions were satisfied
            if (!pending) {
                this._probes[i].deferred.resolve();
                this._probes.splice(i,1);
            } else {
                if (this._probes[i].started + 10000 > Date.now()) {
                    console.error(`Timeout on callback waiting for:`);
                    console.error(this._probes[i].tokenNames);
                    this._probes.splice(i,1);
                }
            }
        }    
    }
}
