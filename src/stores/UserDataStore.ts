import {EventEmmiter} from './../EventEmmiter.ts';

class UserDataStore extends EventEmmiter {
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
                console.log(name);
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
        return this._userService.signin(user)
            .then( (resp) => {
console.log(resp);
                        this._loggedinUser = {
                                name: resp.data.name,
                                pas: '',
                                pas2: '',
                                rem: false,
                                error: ''
                            };
                            this._serverDirectory = resp.data.dir;
                    },
                    (resp) => {
                        console.log(resp);
                        if (resp.data) {
                            switch (resp.data.error) {
                                case 'wrong password':
                                    this._loggedinUser.error = 'Неверный пароль';
                                break;
                                case 'wrong username':
                                    this._loggedinUser.error = 'Неверное имя пользователя';
                                break;
                            }
                        } else {
                            this._loggedinUser.error = 'Неизвестная ошибка';
                        }
                    }
                
            );
    }
    
    // 
    public signup (user: IUser) {
        return this._userService.signup(user)
                .then(  (resp) => {
                            this._loggedinUser = {
                                name: resp.config.data.name,
                                pas: '',
                                pas2: '',
                                rem: false,
                                error: ''
                            };
                            this._serverDirectory = resp.data.dir;
                        },
                        (resp) => {
                            this._loggedinUser = {
                                name: '',
                                pas: '',
                                pas2: '',
                                rem: false,
                                error: resp.status === 403 ? 'Такой пользователь существует' : 'Ошибка сервера'
                            };
                        }
                ); 
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

export function UserDataStoreFactory (dispatcher: IEventEmmiter, $q, userService) {
    var userDataStore = new UserDataStore(userService);
        
    dispatcher.setToken('UserDataStoreDispatchToken', 
        dispatcher.addListener(function (action) {
            dispatcher.startHandling('UserDataStoreDispatchToken');
            switch (action.type) {
                case 'SELECT_USER':
                    // in order to use angular promise, but keep EventEmmiter able to process any type of promises
                    // without injecting $q directly
                    var deferred = $q.defer();
                    dispatcher.waitFor(['UserStoreDispatchToken'], deferred, 'UserDataStoreDispatchToken')
                        .then( () => {
                            userDataStore.setMessage('Selected: ' + action.userId);
                            console.log(userDataStore.getMessage());
                            dispatcher.stopHandling('UserDataStoreDispatchToken');        
                        });                    
                break;
                
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
