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
    
    public deleteUser (userId: number) {
        this._dispatcher.emit({
           type: "DELETE_USER",
           userId: userId 
        });
    }
    
    public signup (user: IUser) {
        this._dispatcher.emit({
           type: "SIGNUP_USER",
           newUser: user 
        });
    }
}