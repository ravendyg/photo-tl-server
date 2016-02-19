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
    
    public signin (user: IUser): void {
        
    }
    
    // clear current user, clear cookie, remove any information associated with the user
    public signout (user: IUser): void {
        this._loggedinUser = {name: ''};
        this._userService.signout(user);
        /** ? */
    }
    
    public signup (user: IUser) {
        return this._userService.signup(user)
                .then(  (resp) => {
                            console.log('success')
                        },
                        (resp) => {
                            this._loggedinUser = {
                                name: '',
                                pas: '',
                                pas2: '',
                                rem: false,
                                error: resp.status === 403 ? 'Такой пользователь существует' : 'Ошибка сервера'
                            };
                            console.log(resp);
                        }
                ); 
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

// class UserStoreFactory {
//     // private _dispatcher: EventEmmiter;
//     private _q: any;
//     private _userStore: UserStore;
    
//     constructor (dispatcher: IEventEmmiter, $q) {
//         // this._dispatcher = dispatcher;
//         this._q = $q;
        
//         this._userStore = new UserStore($q);
        
//         dispatcher.addListener(function (action) {
//             switch (action.type) {
//                 case 'SELECT_USER':
//                     this._userStore.selectUser(action.userId)
//                         .then( () => {
//                             this._userStore.emitChange();
//                         });       
//                 break;
//             }
//         });
//     }
    
//     public addListener (foo): void {
//         this._userStore.addListener(foo);
//     }
    
//     public getUsers () {
//         return this._userStore.getUsers();
//     }
    
//     public getUser () {
//         return this._userStore.getUser();
//     }
// }

// export function UserStoreFactoryFunction (dispatcher, $q) {
//     return new UserStoreFactory(dispatcher, $q);
// }
