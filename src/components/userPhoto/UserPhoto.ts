/// <reference path="../../../typings/tsd.d.ts" />

import {AbstractPhotoController} from './../abstract-photo-controller.ts';

export class UserPhotoController extends AbstractPhotoController {
    // private _userDataStore: any;
    // private _userName: string;
     
    
    constructor($scope, $state, imageStore, imageService, socketService, userDataStore ) {
        
        super ($scope, $state, imageStore, imageService, socketService, userDataStore);
console.log(`user photo`);
        
        // this._userDataStore = userDataStore;
        // this._userName = this._userDataStore.getLoggedInUser().name;
        
        this._resetImages();
        
    }
    
    // process 'change' on image store
    protected _resetImages () {
console.log('reset user photo');
        this._images = this._imageStore.getImages(this._userName);
        this.imagesLoaded = (typeof this._images) === 'undefined';
    }
}