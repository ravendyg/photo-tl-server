import {EventEmmiter} from './../EventEmmiter.ts';
import {config} from './../config.ts';

class UserDataStore extends EventEmmiter {
    private _message: string;
    private _loggedinUser: IUser;
    
    constructor () {
        super();
        
        this._loggedinUser = JSON.parse(localStorage.getItem('photoUser'));
        if (!this._loggedinUser || !this._loggedinUser.name) {
            // no user in the local storage
            this._loggedinUser = {
                name: '',
                pas: '',
                pas2: '',
                rem: false,
                error: ''
            }
        }
    }
    
    public getMessage (): string {
        return this._message;
    }
    
    public setMessage (message: string): void {
        this._message = message;
    }
    
    public getLoggedInUser (): IUser {
        return this._loggedinUser;   
    }
    
    public signin (user: IUser): void {
        
    }
    
    public signup (user: IUser, ajax) {
        return ajax({
                    method: 'POST',
                    url: config('url'),
                    data: user
                })
                .then(  () => console.log('success'),
                        () => {
                            this._loggedinUser = {
                                name: '',
                                pas: '',
                                pas2: '',
                                rem: false,
                                error: 'Отказ сервера'
                            };
                            console.log('failed');
                        }
                );    
    }
    
    public emitChange () {
        this.emit('change');
    }
}

export function UserDataStoreFactory (dispatcher: IEventEmmiter, $q, $http) {
    var userDataStore = new UserDataStore ();
        
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
                    userDataStore.signup(action.newUser, $http)
                        .then( () => {
                            userDataStore.emitChange();
                            dispatcher.stopHandling('UserDataStoreDispatchToken');
                        }); 
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
