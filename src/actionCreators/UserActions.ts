/// <reference path="./../interfaces.d.ts" />

export /**
 * UserActions
 */
class UserActions {
    private _dispatcher: IEventEmmiter;
    
    constructor(dispatcher: IEventEmmiter) {
        this._dispatcher = dispatcher;
    }
       
    public signin (user: IUser) {
        this._dispatcher.emit({
           type: "SIGNIN_USER",
           user: user 
        });
    }
    
    public signup (user: IUser) {
        this._dispatcher.emit({
           type: "SIGNUP_USER",
           newUser: user 
        });
    }
    
    public signout (user: IUser) {
        this._dispatcher.emit({
            type: 'SIGNOUT_USER',
            user: user
        });
    }
    
    public confirmed () {
        this._dispatcher.emit({
            type: 'USER_CONFIRMED'
        });
    }
    
}