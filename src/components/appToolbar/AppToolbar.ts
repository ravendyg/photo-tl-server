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
    private _userService: any;
    private _loggedInUser: any;
    
    constructor($scope, $mdDialog, $mdMedia, userService) {
        this._scope = $scope;
        this._mdDialog = $mdDialog;
        this._mdMedia = $mdMedia;
        this._userService = userService;
        
        this._loggedInUser = this._userService.loggedInUser;
    }
    
    public getLoggedInUser () {
        return this._loggedInUser;
    }
    
    public signIn ($event) {
        var useFullScreen = (this._mdMedia('sm') || this._mdMedia('xs'))  && this._scope.customFullscreen;
        this._mdDialog.show({
            controller: 'LogInController as lgCtrl',
            templateUrl: 'components/logIn/logIn.html',
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose:true,
            fullscreen: useFullScreen
        })
            .then( (answer) => {
                this._scope.status = 'You said the information was "' + answer + '".';
            }, () => {
                this._scope.status = 'You cancelled the dialog.';
            });
            
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
