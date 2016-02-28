/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
export class AbstractPhotoController {
    
    protected _scope: any;
    
    private _state: any;
    
    protected _imageStore: IImageStoreFactory;
    private _imageService: IImageService;
    private _socketService: ISocketService;
    
    protected _userDataStore: any;
    protected _userName: string;
    
    protected _images: IImage [];
    private _uploadedImage: any;

    public imagesLoaded: boolean;   
    
    constructor($scope, $state, imageStore, imageService, socketService, userDataStore) {

        this._scope = $scope;
        this._state = $state;
        
        this._imageStore = imageStore;
        this._imageService = imageService;
        this._socketService = socketService;
        
        // initialize
        // this.resetImages();
        this._uploadedImage = {
            title: '',
            text: '',
            // file: null
        };
        
        // get username
        this._userDataStore = userDataStore;
        this._userName = this._userDataStore.getLoggedInUser().name;
        
        // register with the emmiter
        var _resetImages = () => this._resetImages;   // bind to this
        imageStore.addListener(_resetImages)
        
        // unregister
        $scope.$on('$destroy', () => {
            imageStore.removeListener(_resetImages);
        });
    }
    
    // process 'change' on image store
    protected _resetImages () {
        this._images = this._imageStore.getImages();
        this.imagesLoaded = (typeof this._images) === 'undefined';
    }
    
    // trigger delete photo action ->
    // send a request to the server, when and if it's been executed, server would issue an event through sockets
    public deletePhoto (id: string) {
        this._socketService.removePhoto(id);
    }
 
}