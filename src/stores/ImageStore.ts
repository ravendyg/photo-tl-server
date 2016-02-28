/// <reference path="../../typings/tsd.d.ts" />

import Utils = require('./../Utils.ts');

import {EventEmmiter} from './../EventEmmiter.ts';

class ImageStore extends EventEmmiter {
    private _images: IImage [];
    
    private _eventEmmiter: IEventEmmiter;
    
    constructor (storesActions: IStoresActions) {
        super();
        
        this._eventEmmiter = new EventEmmiter();
        
        this._images = [];
        // start loading image data
        // if server already confirmed user's permission it will get data
        // if not 'user_confirmed' will be triggered to run this method second time
        // this.loadImages();
        
        storesActions.imageStoreReport();
        
    }
    
    // // load image data from the server
    // public loadImages (promise?: any) {
    //     this._imageService.getImageData()
    //         .then( (imagesData) => {
    //                 this._images = imagesData.data;
    //                 // // transform date
    //                 // for (var i=0; i<this._images.length; i++) {
    //                 //     this._images[i].uploaded = Utils.transformDate(this._images[i].uploadedNum);
    //                 // }
    //                 // this.emitChange();
    //                 if (promise) promise.resolve();
    //                 else this.emit();
    //             }, () => {
    //                 console.error('imageService failed');
    //                 if (promise) promise.reject();
    //             }
    //         );
            
    //    return (promise) ? promise.promise || promise : undefined;
    // }
    
    // getter for image data
    public getImages (userName?: string) {
        if (userName) {
            return this._images.filter( (obj) => obj.uploadedBy === userName );    
        } else {
            return this._images;
        }      
    }
    
    // add image
    public addImage (newImage: IImage) {
        this._images.push(newImage);
    }
    // removes specified images
    public filterImageOut (id: string) {
        this._images = this._images.filter( (obj) => obj._id !== id );
        // this._imageService.deleteImage(id);
    }
    // replace rating for specified photo
    public replaceComment (newRating: INewRating) {
        var i = this._images.length-1;
        // for some reason if i use '<' syntax highlighting goes wild
        var changedImage: IImage;
        for (i; i>=0; i-- ) {
            if (this._images[i]._id === newRating._id) {
                // replace average rating
                changedImage = this._images[i];
                changedImage.averageRating = newRating.averageRating;
                for (i=changedImage.rating.length-1; i>=0; i--) {
                    if (changedImage.rating[i].user === newRating.ratingElem.user) {
                        // replace user's rating
                        changedImage.rating[i] = newRating.ratingElem;
                        break;
                    }
                }
                break;
            }
        }
    }
    
    public getAverageRating (photoId: string) {
        // return this._images.filter( (obj) => obj._id === photoId )[0].averageRating.val;
        return 1;
    }
    
    public getUserRating (photoId: string, userName: string) {
        // return this._images.filter( (obj) => obj._id === photoId )[0]
        //     .rating;
        return 0;
    }
}

export function ImageStoreFactory (dispatcher: IDispatcher, storesActions: IStoresActions, $timeout, $q) {
    var imageStore = new ImageStore(storesActions);
    
    function finishWithTimeout () {
        imageStore.emit();
        // gotta use angular timeout to trigger digest on all clients
        $timeout(()=>{});
    }
        
    dispatcher.register(function (action) {
        switch (action.type) {   
            case 'DELETE_PHOTO_SERVER':
                imageStore.filterImageOut(action.photoId);
                finishWithTimeout();
            break;
            
            case 'UPLOAD_PHOTO_SERVER':
                imageStore.addImage(action.image);
                finishWithTimeout();
            break;
            
            case `VOTE_PHOTO_SERVER`:
                imageStore.replaceComment(action.newRating);
                finishWithTimeout();
            break;
            
            case `DOWNLOAD_PHOTO_SERVER`:
                for (var i=0; i<action.images.length; i++) {
                    imageStore.addImage(action.images[i]);
                }
                finishWithTimeout();
            break;
        }
    });
    
    return {
        addListener: (foo) => imageStore.addChangeListener(foo),
        removeListener: (foo) => imageStore.removeChangeListener(foo),
        
        getImages: (userName) => imageStore.getImages(userName),
        getAverageRating: (photoId) => imageStore.getAverageRating(photoId),
        getUserRating: (photoId, userName) => imageStore.getUserRating(photoId, userName)
    }
}