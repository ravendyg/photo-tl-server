/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
export class AbstractPhotoController {
    private _scope: any;
    private _mdDialog: any;
    private _mdMedia: any;
    private _state: any;
    
    protected _imageStore: any;
    private _imageActions: any;
    private _imageService: IImageService;
    private _socketService: ISocketService;
    
    protected _images: IImage;
    private _uploadedImage: any;
    
    private _addPhotoFormDisplayed: boolean;
    
    // private _$mdBottomSheet: any;
    private _listenerIds: number [];

    public imagesLoaded: boolean;   
    
    constructor($scope, $mdDialog, $mdMedia, $state,
                imageStore, imageActions, imageService, socketService
                ) {

        this._scope = $scope;
        this._mdDialog = $mdDialog;
        this._mdMedia = $mdMedia;
        this._state = $state;
        
        this._imageStore = imageStore;
        this._imageActions = imageActions;
        this._imageService = imageService;
        this._socketService = socketService;
        
        this._addPhotoFormDisplayed = false;
        
        // initialize
        // this.resetImages();
        this._uploadedImage = {
            title: '',
            text: '',
            // file: null
        };
        
        // register with the dispatcher
        this._listenerIds = [];
        this._listenerIds.push(imageStore.addListener( () => { this.resetImages(); } ))
        
        // unregister
        $scope.$on('$destroy', () => {
            imageStore.removeListener(this._listenerIds[0]);
            // this._$mdBottomSheet.hide();
        });
        
    }
    
    // process 'change' on image store
    public resetImages () {
        this._images = this._imageStore.getImages();
        this.imagesLoaded = (typeof this._images) === 'undefined';
    }
    
    // trigger delete photo action ->
    // send a request to the server, when and if it's been executed, server would issue an event through sockets
    public deletePhoto (id: string) {
        this._socketService.removePhoto(id);
    }
 
    // hide add photo form
    public cancelAddingPhoto () {
        this._addPhotoFormDisplayed = false;
    }
}