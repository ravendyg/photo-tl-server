/// <reference path="./../interfaces.d.ts" />

import {EventEmmiter} from './../EventEmmiter.ts';

class ImageStore extends EventEmmiter {
    private _imageService: any;
    private _images: IImage [];
    
    constructor (imageService) {
        super();
        
        this._imageService = imageService;
        
    }
    
    public emitChange () {
        this.emit('change');
    }
}

export function ImageStoreFactory (dispatcher: IEventEmmiter, imageService) {
    var imageStore = new ImageStore(imageService);
        
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
        addListener: (foo) => imageStore.addListener(foo),
        removeListener: (listenerId: number) => imageStore.removeListener(listenerId),
        
        getLoggedInUser: () => userDataStore.getLoggedInUser(),
        message: () => userDataStore.getMessage()
    }
}