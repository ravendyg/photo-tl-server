/// <reference path="./../../typings/interfaces.d.ts" />

export /**
 * UserActions
 */
class UserActions {
    private _dispatcher: IDispatcher;
    
    constructor(dispatcher: IDispatcher) {
        this._dispatcher = dispatcher;
    }
       
    public signin (user: IUser) {
        this._dispatcher.dispatch({
           type: "SIGNIN_USER",
           user: user 
        });
    }
    
    public signup (user: IUser) {
        this._dispatcher.dispatch({
           type: "SIGNUP_USER",
           newUser: user 
        });
    }
    
    public signout (user: IUser) {
        this._dispatcher.dispatch({
            type: 'SIGNOUT_USER',
            user: user
        });
    }
    
    public confirmed () {
        this._dispatcher.dispatch({
            type: 'USER_CONFIRMED'
        });
    }
    
}