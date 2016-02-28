/// <reference path="../../typings/tsd.d.ts" />

import {EventEmmiter} from './../EventEmmiter.ts';

class UserDataStore extends EventEmmiter {
    private _message: string;
    private _loggedinUser: IUser;
    private _userService: any;
    
    constructor (userService) {
        super();
        
        this._userService = userService;
        
        // by default not logged in
        this._loggedinUser = {name: ''};
        
        // can be logged in -> check cookies if any verify on the server
        // when done, if a user name received, use it and trigger change
        // this._userService.getUserFromMemory()
        //     .then( (name) => {
        //         if (name) {
        //             this._loggedinUser = {name: name };
        //             this.emit();
        //         }  
        //     });
    }
    
    public getMessage (): string {
        return this._message;
    }
    
    public setUser (name: string): void {
        this._loggedinUser.name = name;
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
}

export function UserDataStoreFactory (dispatcher: IDispatcher, $timeout, userService) {
    var userDataStore = new UserDataStore(userService);
        
        function finishWithTimeout () {
        userDataStore.emit();
        // gotta use angular timeout to trigger digest on all clients
        $timeout(()=>{});
    }
        
    dispatcher.register(function (action) {
        switch (action.type) {
            
            case 'SIGNIN_USER':
                userDataStore.signin(action.user)
                    .then( () => {
                        userDataStore.emit();
                    }); 
            break;
            
            case 'SIGNUP_USER':
                userDataStore.signup(action.newUser)
                    .then( () => {
                        userDataStore.emit();
                    }); 
            break;
            
            case 'SIGNOUT_USER':
                userDataStore.signout(action.user);
                userDataStore.emit();
            break;
            
            case 'USER_CONFIRMED':
                userDataStore.setUser(action.name);
                userDataStore.emit();
                // finishWithTimeout();
            break;
        }
    });
    
    return {
        addListener: (foo) => userDataStore.addChangeListener(foo),
        removeListener: (foo) => userDataStore.removeChangeListener(foo),
        
        getLoggedInUser: () => userDataStore.getLoggedInUser(),
        message: () => userDataStore.getMessage()
    }
}
