/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
export class UserPhotoController {
    private _scope: any;
    private _mdDialog: any;
    private _mdMedia: any;
    private _state: any;
    
    private _imageStore: any;
    private _imageActions: any;
    private _imageService: IImageService;
    private _socketService: ISocketService;
    
    private _images: IImage;
    private _uploadedImage: any;
    
    private _addPhotoFormDisplayed: boolean;
    
    // private _$mdBottomSheet: any;
    private _listenerIds: number [];

    public imagesLoaded: boolean;   
    
    constructor($scope, $mdDialog, $mdMedia, $state,
                imageStore, imageActions, imageService, socketService
                // $mdBottomSheet,
                ) {
        this._scope = $scope;
        this._mdDialog = $mdDialog;
        this._mdMedia = $mdMedia;
        this._state = $state;
        
        this._imageStore = imageStore;
        this._imageActions = imageActions;
        this._imageService = imageService;
        this._socketService = socketService;
        // this._$mdBottomSheet = $mdBottomSheet;
        
        this._addPhotoFormDisplayed = false;
        
        // initialize
        this._resetImages();
        this._uploadedImage = {
            title: '',
            text: '',
            // file: null
        };
        
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
    public startAddingPhoto ($event: any) {
        var useFullScreen = (this._mdMedia('sm') || this._mdMedia('xs'))  && this._scope.customFullscreen;
        this._mdDialog.show({
            controller: 'NewPhotoController as nPhCtrl',
            templateUrl: 'components/new-photo/new-photo.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose:true,
            fullscreen: useFullScreen,
            locals: {
                self: this._mdDialog
            }
        });
            
        this._scope.$watch( () => {
            return this._mdMedia('xs') || this._mdMedia('sm');
        }, (wantsFullScreen) => {
            this._scope.customFullscreen = (wantsFullScreen === true);
        });
    }
        
        // console.log(this._addPhotoFormDisplayed);
        // this._addPhotoFormDisplayed = true;
    // }
    // hide add photo form
    public cancelAddingPhoto () {
        this._addPhotoFormDisplayed = false;
    }
    
    // // upload file to the server
    // public uploadPhoto () {
    //     // selected file
    //     var form = document.getElementById(`newPhoto`);
    //     this._uploadedImage.file = form.querySelector('[name="file"]').files[0];
    //     if (this._uploadedImage.file && this._uploadedImage.file.type.match(/image/)) {
    //         // check file existence and it's type
    //         this._imageService.uploadPhoto(this._uploadedImage.file)
    //         .then( (filename) => {
    //                     console.log(filename)
    //                     console.log(this._uploadedImage.title, this._uploadedImage.text);
    //                     this._socketService.uploadPhoto(filename, this._uploadedImage.title, this._uploadedImage.text);
    //                 }, () => { console.error('error');});
    //     }
    // }
}