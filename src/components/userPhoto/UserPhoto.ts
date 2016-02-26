/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
import {AbstractPhotoController} from './../abstract-photo-controller.ts';

export class UserPhotoController extends AbstractPhotoController {
    // private _userDataStore: any;
    // private _userName: string;
     
    
    constructor($scope, $state, imageStore, imageActions, imageService, socketService, userDataStore ) {
        
        super ($scope, $state, imageStore, imageActions, imageService, socketService, userDataStore);
console.log(`user photo`);
        
        // this._userDataStore = userDataStore;
        // this._userName = this._userDataStore.getLoggedInUser().name;
        
        this._resetImages();
        
    }
    
    // process 'change' on image store
    protected _resetImages () {
        this._images = this._imageStore.getImages(this._userName);
        this.imagesLoaded = (typeof this._images) === 'undefined';
    }
}