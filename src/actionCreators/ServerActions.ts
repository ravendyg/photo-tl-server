/// <reference path="./../interfaces.d.ts" />

export /**
 * ServerActions
 */
class ServerActions {
    private _dispatcher: IEventEmmiter;
    
    constructor(dispatcher: IEventEmmiter) {
        this._dispatcher = dispatcher;
    }
    
    // public signup (user: IUser) {
    //     this._dispatcher.emit({
    //        type: "CONFIRM_USER",
    //        user: user 
    //     });
    // }
}