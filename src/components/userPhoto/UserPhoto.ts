/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
export class UserPhotoController {
    private _imageStore: any;
    private _imageActions: any;
    
    private _images: IImage;
    
    private _addPhotoFormDisplayed: boolean;
    
    // private _$mdBottomSheet: any;
    private _listenerIds: number [];
    private _state: any;
    
    private _imageService: IImageService;
    private _socketService: ISocketService;
    
    public imagesLoaded: boolean;   
    
    constructor(imageStore, imageActions,
                // $mdBottomSheet,
                $scope, $state, imageService, socketService) {
        this._imageStore = imageStore;
        this._imageActions = imageActions;
        
        this._imageService = imageService;
        this._socketService = socketService;
        // this._$mdBottomSheet = $mdBottomSheet;
        this._state = $state;
        this._addPhotoFormDisplayed = false;
        
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
    // send a request to the server, when and if it's been executed, server would issue an event through sockets
    public deletePhoto (id: string) {
        this._socketService.removePhoto(id);
    }
    
    
    
    // show add photo form
    public startAddingPhoto () {
        this._addPhotoFormDisplayed = true;
    }
    // hide add photo form
    public cancelAddingPhoto () {
        this._addPhotoFormDisplayed = false;
    }
    
    // upload file to the server
    public uploadPhoto () {
        // selected file
        var form = document.getElementById(`newPhoto`);
        var file = form.querySelector('[name="file"]');
        var title = form.querySelector('[name="title"]').textContent;
        var text = form.querySelector('[name="text"]').textContent;
        this._imageService.uploadPhoto(file)
            .then( (filename) => {
                        console.log(filename, title, text); 
                    }, () => { console.error('error');});
        
        // this._socketService.uploadPhoto(id);
    }
}