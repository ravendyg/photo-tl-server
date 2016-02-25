/// <reference path="../../../typings/tsd.d.ts" />
/// <reference path="../../../typings/others.d.ts" />
// Create and prepare the 'users' module (with its controllers and dataservices)
import {AbstractPhotoController} from './../abstract-photo-controller.ts';
 
export class AllPhotoController extends AbstractPhotoController {
    
    private _mdDialog: any;
    private _mdMedia: any;
    
    constructor($scope, $mdDialog, $mdMedia, $state,
                imageStore, imageActions, imageService, socketService
                ) {
        super ($scope, $state, imageStore, imageActions, imageService, socketService);
           
        this._mdDialog = $mdDialog;
        this._mdMedia = $mdMedia;
        
        this._resetImages();
console.log(`all photo`); 
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
}