/// <reference path="./../interfaces.d.ts" />

export /**
 * UserActions
 */
class UserActions {
    private _dispatcher: IEventEmmiter;
    
    constructor(dispatcher: IEventEmmiter) {
        this._dispatcher = dispatcher;
    }
    
    public selectUser (userId: number) {
        this._dispatcher.emit({
           type: "SELECT_USER",
           userId: userId 
        });
    }    
}