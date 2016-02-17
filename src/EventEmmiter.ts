/// <reference path="./interfaces.d.ts" />

export class EventEmmiter implements IEventEmmiter {
    private _listeners;
    private _tokens;
    private _pending;
    private _queue;
    // private _handled;
    
    constructor () {
        this._listeners = [];
        this._tokens = {};
        this._pending = {};
        this._queue = {};
    }
    
    public emit (event): void {
        for (var i=0; i<this._listeners.length; i++) {
            this._listeners[i](event);    
        }
    }
    
    public addListener (listener): number {
        this._listeners.push(listener);
        return this._listeners.length - 1;
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
console.log('start ' + tokenName);
    }
    
    public stopHandling (tokenName: string): void {
        this._pending[tokenName] = false;
console.log('stop ' + tokenName);
    }
    
    public waitFor (tokenNames: string [], deferred: any, owner: string): any {
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
        
        // no circular links
        var pending;
        // regularly check thet all store dependencies reported 'done'
        var probe = setInterval( () => {
            pending = false;
            for (var i=0; i<tokenNames.length; i++) {
                console.log(tokenNames[i] + ' pending: ' + this._pending[tokenNames[i]]);
                pending = pending || this._pending[tokenNames[i]];
            }
            // all conditions were satisfied
            if (!pending) {
                clearInterval(probe);
                deferred.resolve();
            }     
        }, 200);

        return promise;
    }
}