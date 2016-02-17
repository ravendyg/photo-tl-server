/// <reference path="./../interfaces.d.ts" />

export /**
 * UserActions
 */
class NotUserActions {
    private _dispatcher: IEventEmmiter;
    
    constructor(dispatcher: IEventEmmiter) {
        this._dispatcher = dispatcher;
    }  
    
    public deleteUser (userId: number) {
        this._dispatcher.emit({
           type: "DELETE_USER",
           userId: userId 
        });
    }
}