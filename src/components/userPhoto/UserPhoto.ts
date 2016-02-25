/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
import {AbstractPhotoController} from './../abstract-photo-controller.ts';

export class UserPhotoController extends AbstractPhotoController {
    private _userDataStore: any;
    private _userName: string;
     
    
    constructor($scope, $mdDialog, $mdMedia, $state,
                imageStore, imageActions, imageService, socketService,
                userDataStore
                ) {
        super ($scope, $mdDialog, $mdMedia, $state,
                imageStore, imageActions, imageService, socketService);
console.log(`user photo`);
        
        this._userDataStore = userDataStore;
        this._userName = this._userDataStore.getLoggedInUser().name;
        
        this.resetImages();
        
    }
    
    // process 'change' on image store
    public resetImages () {
        this._images = this._imageStore.getImages(this._userName);
        this.imagesLoaded = (typeof this._images) === 'undefined';
    }
}