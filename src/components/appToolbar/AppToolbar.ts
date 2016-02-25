/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices) 
// angular.module('photoAlbum')
//      .controller('AppToolbarController', [
//         '$scope', '$mdDialog', '$mdMedia', 'userService',
//         AppToolbarController
//      ]);
export /**
 * AppToolbarController
 */
class AppToolbarController {
    private _scope: any;
    private _mdDialog: any;
    private _mdMedia: any;
    private _timeout: any;
    private _state: any;
    private _userService: any;
    private _loggedInUser: IUser;
    
    private _userDataStore: any;
    private _listenerId: number;
    
    private _userActions: any;
    
    private _originatorEv: any;
    
    private _toDataDisplayed: boolean;
    private _userPhotoDisplayed: boolean;
    
    constructor($scope, $mdDialog, $mdMedia, $timeout, $state, userService, userDataStore, userActions) {
        this._scope = $scope;
        this._mdDialog = $mdDialog;
        this._mdMedia = $mdMedia;
        this._timeout = $timeout;
        this._state = $state;
        this._userService = userService;
        
        this._userDataStore = userDataStore;
        this._userActions = userActions;
        
        this._toDataDisplayed = true;
        
        // what buttons to display
        if (this._state.current.name === `photo.loggedin-my`) {
            this._userPhotoDisplayed = true;
        } else if (this._state.current.name == `photo.loggedin-all`) {
            this._userPhotoDisplayed = false;
        }
        
        // this._loggedInUser = this._userService.loggedInUser;
        this.resetUserInfo();
        
        // registen with the dispatcher
        this._listenerId = this._userDataStore.addListener( () => {
            this.resetUserInfo();
        });
        
        // unregister
        $scope.$on('$destroy', () => {
            this._userDataStore.removeListener(this._listenerId);
        });
    }
    
    private resetUserInfo () {
        this._loggedInUser = this._userDataStore.getLoggedInUser();
    }
    
    public getLoggedInUser () {
        return this._loggedInUser;
    }
    
    /** menu */
    public openUserMenu ($mdOpenMenu, ev) {
        this._originatorEv = ev;
        $mdOpenMenu(ev);
    } 
    // menu element
    public toUserData () {
        this._state.go('photo.user-data')
            // change menu buttons, withou timeout user would see the change
            .then(() => { this._timeout( () => {this._toDataDisplayed = false; }, 500); });
    }
    // menu element
    public toPhoto () {
        if (this._userPhotoDisplayed) {
            this._state.go('photo.loggedin-my')
                // change menu buttons, withou timeout user would see the change
                .then(() => { this._timeout( () => {this._toDataDisplayed = true; }, 500); });
        } else {
            this._state.go('photo.loggedin-all')
                // change menu buttons, withou timeout user would see the change
                .then(() => { this._timeout( () => {this._toDataDisplayed = true; }, 500); });
        }  
    }
    
    public toAllPhotos () {
        this._state.go('photo.loggedin-all')
            .then( () => { this._userPhotoDisplayed = false;} );
    }
    
    public toUserPhotos () {
        this._state.go('photo.loggedin-my')
            .then( () => { this._userPhotoDisplayed = true;} );
    }
    
    public logOut () {
        this._userActions.signout(this._loggedInUser);
        this._toDataDisplayed = true;
    }
    
    public sign ($event: any, mode: string) {
        $event._mode = mode;
        var useFullScreen = (this._mdMedia('sm') || this._mdMedia('xs'))  && this._scope.customFullscreen;
        this._mdDialog.show({
            controller: 'LogInController as lgCtrl',
            templateUrl: 'components/logIn/logIn.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose:true,
            fullscreen: useFullScreen,
            locals: {
                mode: mode,
                self: this._mdDialog
            }
        });
            
        this._scope.$watch( () => {
            return this._mdMedia('xs') || this._mdMedia('sm');
        }, (wantsFullScreen) => {
            this._scope.customFullscreen = (wantsFullScreen === true);
        });
    }

}
