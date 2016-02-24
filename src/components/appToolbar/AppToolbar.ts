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
    private _state: any;
    private _userService: any;
    private _loggedInUser: IUser;
    
    private _userDataStore: any;
    private _listenerId: number;
    
    private _userActions: any;
    
    private _originatorEv: any;
    
    private _toDataDisplayed: boolean;
    
    constructor($scope, $mdDialog, $mdMedia, $state, userService, userDataStore, userActions) {
        this._scope = $scope;
        this._mdDialog = $mdDialog;
        this._mdMedia = $mdMedia;
        this._state = $state;
        this._userService = userService;
        
        this._userDataStore = userDataStore;
        this._userActions = userActions;
        
        this._toDataDisplayed = true;
        
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
    
    public openUserMenu ($mdOpenMenu, ev) {
        this._originatorEv = ev;
        $mdOpenMenu(ev);
    }
    
    public toUserData () {
        this._state.go('photo.user-data')
            .then(() => { this._toDataDisplayed = false; });
    }
    
    public toPhoto () {
        this._state.go('photo.loggedin')
            .then(() => { this._toDataDisplayed = true; });
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
        })
            // .then( (answer) => {
            //     console.log('You said the information was "' + answer + '".');
            // }, () => {
            //     console.log('You cancelled the dialog.');
            // })
            ;
            
            this._scope.$watch( () => {
                return this._mdMedia('xs') || this._mdMedia('sm');
            }, (wantsFullScreen) => {
                this._scope.customFullscreen = (wantsFullScreen === true);
            });
    }
    
    public refresh () {
         this._scope.apply();
    }

}
