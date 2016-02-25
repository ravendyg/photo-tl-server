/// <reference path="./../interfaces.d.ts" />

import {EventEmmiter} from './../EventEmmiter.ts';
import Utils = require('./../Utils.ts');

class ImageStore extends EventEmmiter {
    private _imageService: IImageService;
    private _images: IImage [];
    
    constructor (imageService: IImageService) {
        super();
        
        this._imageService = imageService;
        
        this._images = [];
        // start loading image data
        // if server already confirmed user's permission it will get data
        // if not 'user_confirmed' will be triggered to run this method second time
        this.loadImages();
        
    }
    
    // load image data from the server
    public loadImages (promise?: any) {
        this._imageService.getImageData()
            .then( (imagesData) => {
                    this._images = imagesData.data;
                    // // transform date
                    // for (var i=0; i<this._images.length; i++) {
                    //     this._images[i].uploaded = Utils.transformDate(this._images[i].uploadedNum);
                    // }
                    // this.emitChange();
                    if (promise) promise.resolve();
                    else this.emitChange();
                }, () => {
                    console.error('imageService failed');
                    if (promise) promise.reject();
                }
            );
            
       return (promise) ? promise.promise || promise : undefined;
    }
    
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
    
    public emitChange () {
        this.emit('change');
    }
}

export function ImageStoreFactory (dispatcher: IEventEmmiter, imageService: IImageService, $timeout, $q) {
    var imageStore = new ImageStore(imageService);
        
    dispatcher.setToken('ImageStoreDispatchToken', 
        dispatcher.addListener(function (action) {
            dispatcher.startHandling('ImageStoreDispatchToken');
            switch (action.type) {   
                case 'USER_CONFIRMED':
                    // now we are sure that the user has signedin and the server won't reject our request for photos
                    if (!imageStore.getImages) {
                        // images not loaded
                        var deferred = $q.defer();
                        imageStore.loadImages(deferred)
                            .then( () => {
                                imageStore.emitChange();
                                dispatcher.stopHandling('ImageStoreDispatchToken');
                            });    
                    } else {
                        // already loaded, do nothing
                        dispatcher.stopHandling('ImageStoreDispatchToken');
                    }
                break;
                
                case 'DELETE_PHOTO_SERVER':
                    imageStore.filterImageOut(action.photoId);
                    imageStore.emitChange();
                    dispatcher.stopHandling('ImageStoreDispatchToken');
                    // gotta use angular timeout to trigger digest on all clients
                    $timeout(()=>{});
                break;
                
                case 'UPLOAD_PHOTO_SERVER':
                    imageStore.addImage(action.image);
                    imageStore.emitChange();
                    dispatcher.stopHandling('ImageStoreDispatchToken');
                    // gotta use angular timeout to trigger digest on all clients
                    $timeout(()=>{});
                break;
                
                default:
                    dispatcher.stopHandling('ImageStoreDispatchToken');
            }
        })
    );
    
    return {
        addListener: (foo) => imageStore.addListener(foo),
        removeListener: (listenerId: number) => imageStore.removeListener(listenerId),
        
        getImages: (userName) => imageStore.getImages(userName)
    }
}