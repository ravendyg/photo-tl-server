/// <reference path="../../../typings/tsd.d.ts" />

import {AbstractPhotoController} from './../abstract-photo-controller.ts';

export class UserPhotoController extends AbstractPhotoController {
 
    constructor($scope, $state, imageStore, imageService, socketService, userDataStore ) {
        
        super ($scope, $state, imageStore, imageService, socketService, userDataStore);
        
        this._resetImages();
        
    }
    
    // process 'change' on image store
    protected _resetImages () {
        this._images = this._imageStore.getImages(this._userName);
        this.imagesLoaded = (typeof this._images) === 'undefined';
    }
}