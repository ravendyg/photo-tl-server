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
        this.dispatch('change');
    }
}

export function UserDataStoreFactory (dispatcher: IDispatcher, $q, userService) {
    var userDataStore = new UserDataStore(userService);
        
    dispatcher.register(function (action) {
        switch (action.type) {
            
            case 'SIGNIN_USER':
                userDataStore.signin(action.user)
                    .then( () => {
                        userDataStore.emitChange();
                    }); 
            break;
            
            case 'SIGNUP_USER':
                userDataStore.signup(action.newUser)
                    .then( () => {
                        userDataStore.emitChange();
                    }); 
            break;
            
            case 'SIGNOUT_USER':
                userDataStore.signout(action.user);
                userDataStore.emitChange();
            break;
        }
    });
    
    return {
        addListener: (foo) => userDataStore.register(foo),
        removeListener: (listenerId: number) => userDataStore.unregister(listenerId),
        
        getLoggedInUser: () => userDataStore.getLoggedInUser(),
        message: () => userDataStore.getMessage()
    }
}
