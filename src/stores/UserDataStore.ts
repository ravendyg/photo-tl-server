import {EventEmmiter} from './../EventEmmiter.ts';

class UserDataStore extends EventEmmiter {
    private _message: string;
    
    constructor () {
        super();
    }
    
    public getMessage (): string {
        return this._message;
    }
    
    public setMessage (message: string): void {
        this._message = message;
    }
    
    public emitChange () {
        this.emit('change');
    }
}

export function UserDataStoreFactory (dispatcher: IEventEmmiter, $q) {
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
                default:
                    dispatcher.stopHandling('UserDataStoreDispatchToken');
            }
        })
    );
    
    return {
        addListener: (foo) => userDataStore.addListener(foo),
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
