/// <reference path="../../typings/tsd.d.ts" />

import {Dispatcher} from './../Dispatcher.ts';

class UserDataStore extends Dispatcher {
    private _message: string;
    private _loggedinUser: IUser;
    private _userService: any;
    private _serverDirectory;
    
    constructor (userService) {
        super();
        
        this._userService = userService;
        
        // by default not logged in
        this._loggedinUser = {name: ''};
        this._serverDirectory = '';
        
        // can be logged in -> check cookies if any verify on the server
        // when done, if a user name received, use it and trigger change
        this._userService.getUserFromMemory()
            .then( (name) => {
                if (name) {
                    this._loggedinUser = {name: name };
                    this.emitChange();
                }  
            });
    }
    
    public getMessage (): string {
        return this._message;
    }
    
    public setMessage (message: string): void {
        this._message = message;
    }
    
    public getLoggedInUser () {
        return this._loggedinUser;   
    }
    
    public signin (user: IUser) {
        // ask user service for data
        // keep promise for data
        // pass deferred further
        return this._userService.signin(user)
            .then( (user) => {
                this._loggedinUser = user;
            });
    }
    
    // 
    public signup (user: IUser) {
        // ask user service for data
        // keep promise for data
        // pass deferred further
        return this._userService.signup(user)
            .then( (user) => {
                this._loggedinUser = user;
            }); 
    }
    
    // clear current user, clear cookie, remove any information associated with the user
    public signout (user: IUser): void {
        this._loggedinUser = {name: ''};
        this._userService.signout(user);
        /** ? */
    }
    
    public emitChange () {
        this.emit('change');
    }
}

export function UserDataStoreFactory (dispatcher: IDispatcher, $q, userService) {
    var userDataStore = new UserDataStore(userService);
        
    dispatcher.setToken('UserDataStoreDispatchToken', 
        dispatcher.addListener(function (action) {
            dispatcher.startHandling('UserDataStoreDispatchToken');
            switch (action.type) {
                // case 'SELECT_USER':
                //     // in order to use angular promise, but keep EventEmmiter able to process any type of promises
                //     // without injecting $q directly
                //     var deferred = $q.defer();
                //     dispatcher.waitFor(['UserStoreDispatchToken'], deferred, 'UserDataStoreDispatchToken')
                //         .then( () => {
                //             userDataStore.setMessage('Selected: ' + action.userId);
                //             console.log(userDataStore.getMessage());
                //             dispatcher.stopHandling('UserDataStoreDispatchToken');        
                //         });                    
                // break;
                
                case 'SIGNIN_USER':
                    userDataStore.signin(action.user)
                        .then( () => {
                            userDataStore.emitChange();
                            dispatcher.stopHandling('UserDataStoreDispatchToken');
                        }); 
                break;
                
                case 'SIGNUP_USER':
                    userDataStore.signup(action.newUser)
                        .then( () => {
                            userDataStore.emitChange();
                            dispatcher.stopHandling('UserDataStoreDispatchToken');
                        }); 
                break;
                
                case 'SIGNOUT_USER':
                    userDataStore.signout(action.user);
                    userDataStore.emitChange();
                    dispatcher.stopHandling('UserDataStoreDispatchToken');
                break;
                
                default:
                    dispatcher.stopHandling('UserDataStoreDispatchToken');
            }
        })
    );
    
    return {
        addListener: (foo) => userDataStore.addListener(foo),
        removeListener: (listenerId: number) => userDataStore.removeListener(listenerId),
        
        getLoggedInUser: () => userDataStore.getLoggedInUser(),
        message: () => userDataStore.getMessage()
    }
}
