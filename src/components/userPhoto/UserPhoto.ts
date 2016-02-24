/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
export class UserPhotoController {
    private _imageStore: any;
    private _imageActions: any;
    
    private _images: IImage;
    
    // private _$mdBottomSheet: any;
    private _listenerIds: number [];
    private _state: any;
    
    public imagesLoaded: boolean;   
    
    constructor(imageStore, imageActions,
                // $mdBottomSheet,
                $scope, $state) {
        this._imageStore = imageStore;
        this._imageActions = imageActions;
        // this._$mdBottomSheet = $mdBottomSheet;
        this._state = $state;
        
        // initialize
        this._resetImages();
        
        // register with the dispatcher
        this._listenerIds = [];
        this._listenerIds.push(imageStore.addListener( () => { this._resetImages(); } ))
        
        // unregister
        $scope.$on('$destroy', () => {
            imageStore.removeListener(this._listenerIds[0]);
            // this._$mdBottomSheet.hide();
        });
        
    }
    
    // process 'change' on image store
    private _resetImages () {
        this._images = this._imageStore.getImages();
        this.imagesLoaded = (typeof this._images) === 'undefined';
    }
    
    // trigger delete photo action ->
    // remove it from the store and send a request to the server
    public deletePhoto (id: number) {
        this._imageActions.deletePhoto(id);
    }

}