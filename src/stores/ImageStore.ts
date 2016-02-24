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
        this._loadImages();
        
    }
    
    // load image data from the server
    private _loadImages () {
        this._imageService.getImageData()
            .then( (imagesData) => {
                    this._images = imagesData.data;
                    // transform date
                    for (var i=0; i<this._images.length; i++) {
                        this._images[i].uploaded = Utils.transformDate(this._images[i].uploadedNum);
                    }
                    this.emitChange();
                }, () => {
                    console.error('imageService failed');
                }
            )
        ;
    }
    
    // getter for image data
    public getImages () {
        return this._images;
    }
    // removes specified images
    public filterImageOut (id: number) {
        this._images = this._images.filter( (obj) => obj.id !== id );
        this._imageService.deleteImage(id);
    }
    
    public emitChange () {
        this.emit('change');
    }
}

export function ImageStoreFactory (dispatcher: IEventEmmiter, imageService: IImageService) {
    var imageStore = new ImageStore(imageService);
        
    dispatcher.setToken('ImageStoreDispatchToken', 
        dispatcher.addListener(function (action) {
            dispatcher.startHandling('ImageStoreDispatchToken');
            switch (action.type) {                
                case 'DELETE_PHOTO':
                    imageStore.filterImageOut(action.photoId);
                    imageStore.emitChange();
                    dispatcher.stopHandling('ImageStoreDispatchToken');
                break;
                
                default:
                    dispatcher.stopHandling('ImageStoreDispatchToken');
            }
        })
    );
    
    return {
        addListener: (foo) => imageStore.addListener(foo),
        removeListener: (listenerId: number) => imageStore.removeListener(listenerId),
        
        getImages: () => imageStore.getImages()
    }
}