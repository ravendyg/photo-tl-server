/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
export class UserPhotoController {
    private _userStore: any;
    private _imageStore: any;
    
    private _userActions: any;
    private _imageActions: any;
    
    private _user: any;
    private _images: IImage;
    
    // private _$mdBottomSheet: any;
    private _listenerIds: number [];
    private _state: any;
    
    
    
    constructor(userStore, imageStore, userActions, imageActions,
                // $mdBottomSheet,
                $scope, $state) {
        this._userStore = userStore;
        this._userActions = userActions;
        this._imageStore = imageStore;
        this._imageActions = imageActions;
        // this._$mdBottomSheet = $mdBottomSheet;
        this._state = $state;
        
        this._resetItems();
        // this._resetImages();
        
        // register with the dispatcher
        this._listenerIds = [];
        this._listenerIds.push(userStore.addListener( () => { this._resetItems(); } ));
        this._listenerIds.push(imageStore.addListener( () => { this._resetImages(); } ))
        
        // unregister
        $scope.$on('$destroy', () => {
            userStore.removeListener(this._listenerIds[0]);
            imageStore.removeListener(this._listenerIds[1]);
            // this._$mdBottomSheet.hide();
        });
        
    }
    
    // process 'change' on user store - to be removed 
    private _resetItems () {
        this._user = this._userStore.user();
        if (!this._user.name) {
            console.log('loggedout');
            this._state.go('photo');    
        } 
    }
    
    // process 'change' on image store
    private _resetImages () {
        this._images = this._imageStore.getImages();
console.log(this._images);
    }
    
    // trigger delete photo action ->
    // remove it from the store and send a request to the server
    public deletePhoto (id: number) {
        this._imageActions.deletePhoto(id);
    }
    
    // to be removed
    public consoleImages () {
        console.log(this._images);
    }
    
    // to be removed
    public getUser () {
        return this._user;
    }
    
    // to be removed
    public deleteUser (userId: number) {
        this._userActions.deleteUser(userId);
    }
}